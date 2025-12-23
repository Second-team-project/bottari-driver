import { configureStore } from "@reduxjs/toolkit";
import { injectStoreInAxios } from "../api/axiosInstance.js";

// slice import
import authReducer from './slices/authSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
  }
});

injectStoreInAxios(store);

export default store;