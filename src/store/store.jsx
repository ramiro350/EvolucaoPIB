import { configureStore } from '@reduxjs/toolkit';
import ibgeReducer from './ibgeSlice';

export const store = configureStore({
  reducer: {
    ibge: ibgeReducer,
  },
});

export default store;