import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import ApplicationReducer from 'src/features/Application/application.slice';

export const store = configureStore({
  reducer: {
    ApplicationReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
