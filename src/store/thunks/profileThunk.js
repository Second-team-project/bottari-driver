import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

export const profileThunk = createAsyncThunk(
  'profile/profileThunk',
  async (updatedData, { rejectWithValue }) => {
    try {
      const url = '/api/driver/profile/edit';

      const response = await axiosInstance.patch(url, updatedData);

      return response.data;
    } catch (error) {
      const serializedError = {
        message: error.message,
        status: error.response?.status || null,
        data: error.response?.data || null,
      };
      return rejectWithValue(serializedError);
    }
  }
);