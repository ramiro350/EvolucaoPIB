import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const fetchIbgeData = createAsyncThunk(
  'ibge/fetchData',
  async ({ startYear = 2015, endYear = 2022 } = {}, { rejectWithValue }) => {
    try {
      const periodos = `${startYear}-${endYear}`;
      
      
      const [pibTotalResponse, pibPerCapitaResponse] = await Promise.all([
        axios.get(`https://servicodados.ibge.gov.br/api/v3/agregados/6784/periodos/${periodos}/variaveis/9808?localidades=BR`),
        axios.get(`https://servicodados.ibge.gov.br/api/v3/agregados/6784/periodos/${periodos}/variaveis/9812?localidades=BR`)
      ]);

      return {
        pibTotal: pibTotalResponse.data,
        pibPerCapita: pibPerCapitaResponse.data
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  pibTotal: null,
  pibPerCapita: null,
  loading: false,
  error: null,
  yearsRange: { start: 2015, end: 2022 },
  selectedVariables: ['pibTotal', 'pibPerCapita']
};

const ibgeSlice = createSlice({
  name: 'ibge',
  initialState,
  reducers: {
    setYearsRange: (state, action) => {
      state.yearsRange = action.payload;
    },
    setSelectedVariables: (state, action) => {
      state.selectedVariables = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIbgeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIbgeData.fulfilled, (state, action) => {
        state.loading = false;
        state.pibTotal = action.payload.pibTotal;
        state.pibPerCapita = action.payload.pibPerCapita;
        state.error = null;
      })
      .addCase(fetchIbgeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.pibTotal = null;
        state.pibPerCapita = null;
      });
  },
});

export const { setYearsRange, setSelectedVariables, clearError } = ibgeSlice.actions;
export default ibgeSlice.reducer;