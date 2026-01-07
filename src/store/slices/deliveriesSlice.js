import { createSlice } from '@reduxjs/toolkit';
import { assignedThunk, updateStateThunk } from '../thunks/deliveriesThunk';
import { logoutThunk } from '../thunks/authThunk.js';

const initialState = {
  list: [],            // 가공된 배송 목록 배열
  monthPerformance: 0, // 월 별 완료 건 수
  todayPerformance: 0, // 오늘 완료 건 수
  
  loading: false,      // 로딩 상태
  error: null,         // 에러 메세지
};

const deliverySlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {
    clearDeliveryData(state) {
      state.list = [];
      state.monthPerformance = 0;
      state.todayPerformance = 0;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 배송 목록 조회 (기사 배정 내역)
      .addCase(assignedThunk.fulfilled, (state, action) => {
        state.loading = false;

        const { list, todayPerformance, monthPerformance } = action.payload.data;

        state.list = list;
        state.todayPerformance = todayPerformance;
        state.monthPerformance = monthPerformance;
      })
      .addCase(updateStateThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        return initialState;
      })

      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearDeliveryData } = deliverySlice.actions;
export default deliverySlice.reducer;