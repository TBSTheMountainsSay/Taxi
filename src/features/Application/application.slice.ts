import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  TDriverProps,
  TOrderProps,
  typeCurrentAddress,
} from './Application.types';
import { RootState } from '../../app/store';

export interface applicationState {
  currentAddress: typeCurrentAddress[];
  drivers: TDriverProps[];
  order: TOrderProps[];
  meta: {
    fetching: boolean;
    creating: boolean;
    editing: boolean;
    deleting: boolean;
  };
}

const initialState: applicationState = {
  currentAddress: [],
  drivers: [
    {
      crew_id: 1,
      car_mark: 'Chevrolet',
      car_model: 'Tahoe',
      car_color: 'Чёрный',
      car_number: 'А832ТС',
      driver_name: 'Алексей',
      driver_phone: '7(70)936-01-96',
      lat: 56.855348,
      lon: 53.214337,
    },
    {
      crew_id: 2,
      car_mark: 'Hyundai',
      car_model: 'Solaris',
      car_color: 'Синий',
      car_number: 'Р102МС',
      driver_name: 'Антон',
      driver_phone: '7(324)088-13-82',
      lat: 56.874459,
      lon: 53.259335,
    },
    {
      crew_id: 3,
      car_mark: 'Reno',
      car_model: 'Logan',
      car_color: 'Серый',
      car_number: 'О265СМ',
      driver_name: 'Владимир',
      driver_phone: '7(64)765-19-21',
      lat: 56.834796,
      lon: 53.258822,
    },
    {
      crew_id: 4,
      car_mark: 'Lada',
      car_model: 'Vesta',
      car_color: 'Белый',
      car_number: 'М110НА',
      driver_name: 'Яков',
      driver_phone: '7(25)279-81-30',
      lat: 56.825691,
      lon: 53.158953,
    },
    {
      crew_id: 5,
      car_mark: 'Kia',
      car_model: 'Rio',
      car_color: 'Красный',
      car_number: 'О731ЕЕ',
      driver_name: 'Сергей',
      driver_phone: '7(704)274-50-19',
      lat: 56.870878,
      lon: 53.186418,
    },
    {
      crew_id: 6,
      car_mark: 'Ford',
      car_model: 'Mustang',
      car_color: 'Жёлтый',
      car_number: 'О272ОК',
      driver_name: 'Иван',
      driver_phone: '7(356)355-01-00',
      lat: 56.851907,
      lon: 53.300462,
    },
    {
      crew_id: 7,
      car_mark: 'Dodge',
      car_model: 'Charger',
      car_color: 'Красный',
      car_number: 'У729АХ',
      driver_name: 'Андрей',
      driver_phone: '7(795)888-52-19',
      lat: 56.839479,
      lon: 53.211669,
    },
    {
      crew_id: 8,
      car_mark: 'Tesla',
      car_model: 'Model X',
      car_color: 'Серый',
      car_number: 'Н581СМ',
      driver_name: 'Илон',
      driver_phone: '7(39)764-34-23',
      lat: 56.850368,
      lon: 53.26004,
    },
  ],
  order: [{ source_time: '', addresses: [], crew_id: 0, order_id: 0 }],
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
      action: PayloadAction<{ coordinates: [number, number]; address: string }>
    ) => {
      const currentAddress = {
        address: action.payload.address,
        lat: action.payload.coordinates[0],
        lon: action.payload.coordinates[1],
      };
      state.currentAddress.splice(0, 3, currentAddress);
    },

    createOrder: (
      state,
      action: PayloadAction<{ source_time: string; crew_id: number }>
    ) => {
      const newOrder = {
        source_time: action.payload.source_time,
        addresses: state.currentAddress,
        crew_id: action.payload.crew_id,
        order_id: state.order[state.order.length - 1].order_id + 1,
      };
      state.order.push(newOrder);
    },
  },
});

export const { changeCurrentAddress, createOrder } = applicationSlice.actions;

export default applicationSlice.reducer;
