import { configureStore } from "@reduxjs/toolkit";

// slice import
import menuReducer from "./slices/menuSlice.js";

export default configureStore({
  reducer: {
    menu: menuReducer,
  }
});