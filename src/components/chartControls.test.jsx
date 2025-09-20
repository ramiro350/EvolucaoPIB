import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, test, vi, beforeEach } from 'vitest';
import ChartControls from './chartControls';
import ibgeReducer from '../store/ibgeSlice';

// Mock the async thunk to avoid actual API calls
vi.mock('../store/ibgeSlice', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    fetchIbgeData: vi.fn(() => ({ type: 'mock/fetchData' })),
  };
});

describe('ChartControls', () => {
  const mockStore = configureStore({
    reducer: {
      ibge: ibgeReducer
    }
  });

  const createMockStore = (preloadedState = {}) => {
    return configureStore({
      reducer: {
        ibge: ibgeReducer
      },
      preloadedState: {
        ibge: {
          loading: false,
          yearsRange: { start: 2000, end: 2020 },
          selectedVariables: [],
          error: null,
          pibTotal: null,
          pibPerCapita: null,
          ...preloadedState
        }
      }
    });
  };

  const renderWithStore = (preloadedState = {}) => {
    const store = createMockStore(preloadedState);

    return render(
      <Provider store={store}>
        <ChartControls />
      </Provider>
    );
  };

  test('renders ChartControls with initial state', () => {
    renderWithStore();

    expect(screen.getByText(/Configurações do Gráfico/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ano Inicial:/)).toHaveValue(2000);
    expect(screen.getByLabelText(/Ano Final:/)).toHaveValue(2020);
  });

  test('handles year input changes', () => {
    renderWithStore();

    const startYearInput = screen.getByLabelText(/Ano Inicial:/);
    const endYearInput = screen.getByLabelText(/Ano Final:/);

    fireEvent.change(startYearInput, { target: { value: '2010' } });
    fireEvent.change(endYearInput, { target: { value: '2022' } });

    expect(startYearInput).toHaveValue(2010);
    expect(endYearInput).toHaveValue(2022);
  });

  test('disables button when no variables selected', () => {
    renderWithStore({ selectedVariables: [] });

    expect(screen.getByText('Atualizar Dados')).toBeDisabled();
    expect(screen.getByText('Selecione pelo menos uma variável')).toBeInTheDocument();
  });

  test('enables button when variables are selected', () => {
    renderWithStore({ selectedVariables: ['pibTotal'] });

    expect(screen.getByText('Atualizar Dados')).not.toBeDisabled();
  });
});