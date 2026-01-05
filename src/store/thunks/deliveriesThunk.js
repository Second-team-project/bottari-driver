import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

// 배송 목록 조회 Thunk
export const assignedThunk = createAsyncThunk(
  'deliveries/assignedThunk',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/driver/deliveries/assigned');
      return response.data; // 서비스에서 가공해서 보낸 배열
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateStateThunk = createAsyncThunk(
  'deliveries/updateStateThunk',
  async ({ resId, currentState }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch('/api/driver/deliveries/state', { resId, currentState });
      
      return { resId, nextState: response.data.data.nextState };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);