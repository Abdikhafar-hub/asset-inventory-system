import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchAssets = createAsyncThunk('assets/fetchAssets', async () => {
  const response = await api.get('/Assets');
  return response.data;
});

const assetSlice = createSlice({
  name: 'assets',
  initialState: { items: [], status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssets.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchAssets.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default assetSlice.reducer;
