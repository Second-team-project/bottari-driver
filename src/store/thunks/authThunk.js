import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

export const loginThunk = createAsyncThunk(
  'auth/loginThunk',
  async (args, { rejectWithValue }) => {
    try {
      const url = '/api/driver/auth/login';
      const { id, password } = args;

      const response = await axiosInstance.post(url, { id, password });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { msg: error.message });
    }
  }
);

// 토큰 재발급
export const reissueThunk = createAsyncThunk(
  'auth/reissueThunk',
  async (args, { rejectWithValue }) => {
    try {
      const url = '/api/driver/auth/reissue';

      const response = await axiosInstance.post(url);

      return response.data;
    } catch(error) {
      return rejectWithValue(error.response?.data || { msg: error.message });
    }
  }
);

// 로그아웃
export const logoutThunk = createAsyncThunk(
  'auth/logoutThunk',
  async (_, { rejectWithValue }) => {
    try {
      const url = '/api/driver/auth/logout';

      const response = await axiosInstance.post(url);

      return response.data;
    } catch(error) {
      return rejectWithValue(error.response?.data || { msg: error.message });
    }
  }
);