import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

// 1. 초기 로드 시 현재 출퇴근 상태 가져오기
export const statusThunk = createAsyncThunk(
  'attendance/statusThunk',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/driver/attendance/status');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// 2. 출퇴근 상태 변경하기 (토글)
export const toggleThunk = createAsyncThunk(
  'attendance/toggleThunk',
  async ({ nextState }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/driver/attendance/toggle', { nextState });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);