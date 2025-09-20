import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import ibgeReducer from './store/ibgeSlice';

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = configureStore({
      reducer: { ibge: ibgeReducer },
      preloadedState
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';