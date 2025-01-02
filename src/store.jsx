// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import assetReducer from './features/assets/assetSlice';
import requestReducer from './features/requests/requestSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    assets: assetReducer,
    requests: requestReducer,
  },
});
