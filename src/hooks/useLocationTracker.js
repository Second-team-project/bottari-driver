import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { updateLocationThunk } from '../store/thunks/locationThunk.js';

/**
 * GPS 위치 추적 커스텀 훅
 * - startTracking: 1분마다 위치 저장 시작
 * - stopTracking: 위치 저장 중지
 */
const useLocationTracker = () => {
  const dispatch = useDispatch();
  const intervalRef = useRef(null);

  // GPS 위치 가져와서 서버에 저장
  const saveCurrentLocation = () => {
    // 1. 브라우저 미 지원 시
    if (!navigator.geolocation) {
      toast.error("이 브라우저에서는 GPS를 지원하지 않습니다.");
      return;
    }

    // 2. 브라우저 지원 시
    navigator.geolocation.getCurrentPosition(
      // 2-1. 성공 콜백
      (position) => {
        const { latitude, longitude } = position.coords;
        // GPS 저장 api 호출
        dispatch(updateLocationThunk({ lat: latitude, lng: longitude }));
      },
      // 2-2. 실패 콜백
      (error) => {
        switch (error.code) {
          case 1:
            toast.error("위치 권한이 거부되었습니다.");
            break;
          case 2:
            toast.error("위치를 가져올 수 없습니다.");
            break;
          case 3:
            toast.error("위치 요청 시간이 초과되었습니다.");
            break;
          default:
            toast.error("위치 오류가 발생했습니다.");
        }
      },
      // 2-3 옵션 객체
      {
        // TODO: 'ture' - GPS 정확도 높임, 배터리 더 소모, 모바일에 이득
        // 테스트 환경이므로 pc 에 맞춰서 false
        enableHighAccuracy: false, 
        // TODO : 배포시 10초로 바꿀지 결정 필요
        timeout: 30000,            // 10초 안에 못 얻으면 에러
        maximumAge: 0              // 캐시된 위치 사용 안 함
      }
    );
  };

  // 추적 시작 (즉시 1회 + 1분마다 반복)
  const startTracking = () => {
    // 이미 실행 중이면 중복 방지
    if (intervalRef.current) return;

    saveCurrentLocation(); // 즉시 1회 실행
    intervalRef.current = setInterval(saveCurrentLocation, 60000); // 1분마다
  };

  // 추적 중지
  const stopTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return { startTracking, stopTracking };
};

export default useLocationTracker;
