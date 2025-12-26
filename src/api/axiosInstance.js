import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import { reissueThunk } from '../store/thunks/authThunk.js';
import { clearAuth } from '../store/slices/authSlice.js';

// store 저장용 변수
let store = null;
// 재발급 진행 상태를 담을 변수
let reissuePromise = null;

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
  const skipUrls = ['/api/driver/auth/reissue', '/api/driver/auth/login'];
  if (skipUrls.some(url => config.url.includes(url))) return config;

  let { accessToken } = store.getState().auth;

  try {
    let needsReissue = false;

    if (!accessToken) {
      needsReissue = true;
    } else {
      const claims = jwtDecode(accessToken);
      const now = dayjs().unix();
      const expTime = dayjs.unix(claims.exp).add(-5, 'minute').unix();
      if (now >= expTime) needsReissue = true;
    }

    if (needsReissue) {
      try {
        // 이미 진행 중인 재발급이 있다면 그 Promise를 기다립니다.
        if (!reissuePromise) {
          reissuePromise = store.dispatch(reissueThunk()).unwrap()
            .finally(() => {
              reissuePromise = null; // 완료 후 초기화
            });
        }
        
        const response = await reissuePromise;
        accessToken = response.data.accessToken;
      } catch (reissueError) {
        store.dispatch(clearAuth());
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(reissueError);
      }
    }

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    
    return config;
  } catch(error) {
    return Promise.reject(error);
  }
});


export default axiosInstance;