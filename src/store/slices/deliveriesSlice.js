import { createSlice } from '@reduxjs/toolkit';
import { assignedThunk } from '../thunks/deliveriesThunk';

const initialState = {
  list: [],            // 가공된 배송 목록 배열
  loading: false,      // 로딩 상태
  error: null,         // 에러 메세지
};

const deliverySlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {
    // 로그아웃 시 혹은 데이터 초기화가 필요할 때 사용
    clearDeliveryData(state) {
      state.list = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(assignedThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
      })
      // 배송 목록 조회 (기사 배정 내역)
      .addCase(assignedThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignedThunk.rejected, (state, action) => {
        state.loading = false;
        // Thunk에서 rejectWithValue로 보낸 에러 정보 저장
        state.error = action.payload?.data?.msg || "배송 정보를 가져오는데 실패했습니다.";
      });
  },
});

export const { clearDeliveryData } = deliverySlice.actions;
export default deliverySlice.reducer;