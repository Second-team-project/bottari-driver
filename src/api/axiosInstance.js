import axios from 'axios';

// TODO: 인증용 로직 추가 필요

// axios 인스턴스 생성         ↱ axios 인스턴스 생성
const axiosIns = axios.create({
  baseURL: import.meta.env.VITE_APP_URL,  // 기본 URL (axios 호출 시 가장 앞에 자동으로 연결하여 동작)
  headers: {
    'Content-Type': 'application/json',
  },
  // 크로스 도메인    ↱ default : false
  // 서로 다른 도메인에 요청 보낼 때, credential 정보를 담아 보낼지 여부
  // credential 정보 : 1. 쿠키, 2. 헤더 Authorization 항목
  withCredentials: true,
});

export default axiosIns;