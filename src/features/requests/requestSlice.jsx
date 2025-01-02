import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchRequests = createAsyncThunk('requests/fetchRequests', async () => {
  const response = await api.get('/Requests');
  return response.data;
});

const requestSlice = createSlice({
  name: 'requests',
  initialState: { items: [], status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequests.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchRequests.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default requestSlice.reducer;
