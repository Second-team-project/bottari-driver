import { configureStore } from "@reduxjs/toolkit";
import { injectStoreInAxios } from "../api/axiosInstance.js";

// slice import
import authReducer from './slices/authSlice.js';
import deliveriesReducer from './slices/deliveriesSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    deliveries : deliveriesReducer,
  }
});

injectStoreInAxios(store);

export default store;