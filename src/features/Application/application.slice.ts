import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TDriver, TOrder, typeCurrentAddress } from './Application.types';
import { RootState } from '../../app/store';
import { applicationAPI } from '../../api/applicationAPI';

export interface applicationState {
  currentAddress: typeCurrentAddress | null;
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
        source_time: string;
        address: string;
        coordinates: [number, number];
        crew_id?: number;
      }>
    ) => {
      const currentAddress = {
        source_time: action.payload.source_time,
        addresses: {
          address: action.payload.address,
          lat: action.payload.coordinates[0],
          lon: action.payload.coordinates[1],
        },
        crew_id: action.payload.crew_id,
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
        source_time: globalState.ApplicationReducer.currentAddress.source_time,
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
  async (_, thunkAPI) => {
    const globalState = thunkAPI.getState() as RootState;
    if (!globalState.ApplicationReducer.currentAddress)
      return thunkAPI.rejectWithValue('');
    try {
      const addressInfo = {
        source_time: globalState.ApplicationReducer.currentAddress.source_time,
        addresses: [
          {
            address:
              globalState.ApplicationReducer.currentAddress.addresses.address,
            lat: globalState.ApplicationReducer.currentAddress.addresses.lat,
            lon: globalState.ApplicationReducer.currentAddress.addresses.lon,
          },
        ],
        crew_id: globalState.ApplicationReducer.currentAddress.crew_id,
      };
      const { data } = await applicationAPI.createOrder(
        addressInfo.source_time,
        addressInfo.addresses,
        addressInfo.crew_id
      );
      return data;
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

export default applicationSlice.reducer;
