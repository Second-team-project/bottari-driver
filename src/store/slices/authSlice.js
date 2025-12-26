import { createSlice } from '@reduxjs/toolkit';
import { loginThunk, reissueThunk } from '../thunks/authThunk.js';
import { profileThunk } from '../thunks/profileThunk.js';
import { statusThunk, toggleThunk } from '../thunks/attendanceThunk.js';
import axiosInstance from '../../api/axiosInstance.js';

const initialState = {
  accessToken: null,
  driver: null,
  isLoggedIn: false,
  isAttendanceState: false, // 출퇴근 상태
}

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth(state) {
      state.accessToken = null;
      state.user = null;
      state.isLoggedIn = false;
      state.isAttendanceState = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // 1. 로그인 및 토큰 재발급
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
      // 2. 개인정보 수정 (프로필 업데이트)
      .addCase(profileThunk.fulfilled, (state, action) => {
        const { driver, accessToken } = action.payload.data;
    
        if (driver) state.driver = driver;
        if (accessToken) {
          state.accessToken = accessToken;
          state.isLoggedIn = true;
          
          // 전역 axios 인스턴스의 헤더를 즉시 교체해줍니다.
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        }
      })
      // 3. 출퇴근 상태 관리
      .addCase(statusThunk.fulfilled, (state, action) => {
        // 서버 응답의 state가 CLOCKED_IN 이면 true
        state.isAttendanceState = action.payload.data.state === 'CLOCKED_IN';
      })
      .addCase(toggleThunk.fulfilled, (state, action) => {
        // 출퇴근 토글 성공 시 상태 반영
        state.isAttendanceState = action.payload.data.state === 'CLOCKED_IN';
      });
  },
});

// reducers의 action들을 내보내는 처리
export const {
  clearAuth
} = slice.actions;

export default slice.reducer;