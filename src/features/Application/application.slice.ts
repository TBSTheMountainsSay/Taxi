import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TDriverProps, typeCurrentAddress } from './Application.types';

export interface applicationState {
  currentAddress: typeCurrentAddress[];
  drivers: TDriverProps[];
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
      distance: 0,
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
      distance: 0,
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
      distance: 0,
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
      distance: 0,
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
      distance: 0,
    },
  ],
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
  reducers: {},
});

export const {} = applicationSlice.actions;

export default applicationSlice.reducer;
