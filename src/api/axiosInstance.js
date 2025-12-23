import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import { reissueThunk } from '../store/thunks/authThunk.js';

// store 저장용 변수
let store = null;

// store 주입용 함수
export function injectStoreInAxios(_store) {
 store = _store;
}

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: '', // 기본 URL (axios 호출 시, 가장 앞에 자동으로 연결하여 동작)
  headers: {
    'Content-Type': 'application/json',
  },
  // 크로스 도메인(서로 다른 도메인)에 요청 보낼때, credential 정보를 담아서 보낼지 여부 설정
  // credential 정보 : 1. 쿠키, 2 헤더 Authorization 항목 등등
  withCredentials: true,
});

axiosInstance.interceptors.request.use(async (config) => {
  const noRetry = /^\/api\/auth\/reissue$/; // 리트라이 제외 URL 설정
  let { accessToken } = store.getState().auth; // auth state 획득

  try {
    //액세스 토큰 있음 && 리트라이 제외 URL 아님
    if(accessToken && !noRetry.test(config.url)) {
      // 엑세스 토큰 만료 확인
      const claims = jwtDecode(accessToken);
      const now = dayjs().unix();
      const expTime = dayjs.unix(claims.exp).add(-5, 'minute').unix();
      
      if(now >= expTime) {
        const response = await store.dispatch(reissueThunk()).unwrap();

        accessToken = response.data.accessToken;
      }
  
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
  
    return config;
  } catch(error) {
    
    return Promise.reject(error);
  }
});


export default axiosInstance;