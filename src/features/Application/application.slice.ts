import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TDriver, TOrder, TGeolocation } from './Application.types';
import { RootState } from '../../app/store';
import { applicationAPI } from '../../api/applicationAPI';
import { getDate } from '../../utils';

export interface applicationState {
  currentAddress: TGeolocation | null;
  drivers: TDriver[];
  orders: TOrder[];
  meta: {
    fetching: boolean;
    creating: boolean;
    editing: boolean;
    deleting: boolean;
  };
}

const initialState: applicationState = {
  currentAddress: null,
  drivers: [],
  orders: [],
  meta: {
    fetching: false,
    creating: false,
    editing: false,
    deleting: false,
  },
};

const applicationSlice = createSlice({
  name: 'ApplicationReducer',
  initialState,
  reducers: {
    changeCurrentAddress: (
      state,
      action: PayloadAction<{
        address: string;
        coordinates: [number, number];
      }>
    ) => {
      const currentAddress = {
        addresses: {
          address: action.payload.address,
          lat: action.payload.coordinates[0],
          lon: action.payload.coordinates[1],
        },
      };
      state.currentAddress = currentAddress;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createOrderThunk.fulfilled, (state, action) => {
      state.orders.push(action.payload);
    });

    builder.addCase(getCrewsThunk.fulfilled, (state, action) => {
      state.drivers = action.payload.crews_info;
    });
  },
});

export const { changeCurrentAddress } = applicationSlice.actions;

export const getCrewsThunk = createAsyncThunk(
  'ApplicationReducer/getCrews',
  async (_, thunkAPI) => {
    const globalState = thunkAPI.getState() as RootState;
    if (!globalState.ApplicationReducer.currentAddress)
      return thunkAPI.rejectWithValue('');
    try {
      const addressInfo = {
        source_time: getDate(),
        addresses: [
          {
            address:
              globalState.ApplicationReducer.currentAddress.addresses.address,
            lat: globalState.ApplicationReducer.currentAddress.addresses.lat,
            lon: globalState.ApplicationReducer.currentAddress.addresses.lon,
          },
        ],
      };
      const { data } = await applicationAPI.getCrews(
        addressInfo.source_time,
        addressInfo.addresses
      );
      return data;
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

export const createOrderThunk = createAsyncThunk(
  'ApplicationReducer/createOrder',
  async (nearestDriverId: number, thunkAPI) => {
    const globalState = thunkAPI.getState() as RootState;
    if (!globalState.ApplicationReducer.currentAddress)
      return thunkAPI.rejectWithValue('');
    try {
      const addressInfo = {
        addresses: [
          {
            address:
              globalState.ApplicationReducer.currentAddress.addresses.address,
            lat: globalState.ApplicationReducer.currentAddress.addresses.lat,
            lon: globalState.ApplicationReducer.currentAddress.addresses.lon,
          },
        ],
      };
      const { data } = await applicationAPI.createOrder(
        getDate(),
        addressInfo.addresses,
        nearestDriverId
      );
      return data;
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

export default applicationSlice.reducer;
