import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const updateLocationThunk = createAsyncThunk(
  'location/saveLocationThunk',
  async ({ lat, lng }, { rejectWithValue }) => {
    try {
      const url = '/api/driver/location'
      const response = await axiosInstance.post(url, { lat, lng })

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
)
