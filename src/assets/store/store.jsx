import { configureStore } from '@reduxjs/toolkit';
import ibgeReducer from './ibgeGraph';

export const store = configureStore({
  reducer: {
    ibge: ibgeReducer,
  },
});

export default store;