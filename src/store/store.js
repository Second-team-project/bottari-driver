import { configureStore } from "@reduxjs/toolkit";

// slice import
import authReducer from './slices/authSlice.js';

export default configureStore({
  reducer: {
    auth: authReducer,
  }
});