import { createSlice } from '@reduxjs/toolkit';
import { loginThunk, reissueThunk } from '../thunks/authThunk.js';

const initialState = {
  accessToken: null,
  driver: null,
  isLoggedIn: false,
}

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth(state) {
      state.accessToken = null;
      state.user = null;
      state.isLoggedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.fulfilled, (state, action) => {
        const { accessToken, driver } = action.payload.data;
        state.accessToken = accessToken;
        state.driver = driver;
        state.isLoggedIn = true;
      })
      .addCase(reissueThunk.fulfilled, (state, action) => {
        const { accessToken, driver } = action.payload.data;
        state.accessToken = accessToken;
        state.driver = driver;
        state.isLoggedIn = true;
      })
  },
});

// reducers의 action들을 내보내는 처리
export const {
  clearAuth
} = slice.actions;

export default slice.reducer;