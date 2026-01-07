// localStorage 유틸리티

/**
 * 24시간 동안 알림 모달을 숨기기 위한 만료 시간 저장
 */
export const saveNotificationExpire = () => {
  try {
    const expireTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 현재 시간 + 24시간
    localStorage.setItem(import.meta.env.VITE_NOTIFICATION_EXPIRE_KEY, expireTime.toString());
  } catch (error) {
    console.error('localStorage 저장 실패:', error);
  }
};

/**
 * 알림 모달이 숨김 상태인지 확인
 * @returns {boolean} true: 아직 24시간 안 지남 (숨김 유지), false: 지났거나 데이터 없음 (다시 표시)
 */
export const isNotificationHidden = () => {
  try {
    const expireTime = localStorage.getItem(import.meta.env.VITE_NOTIFICATION_EXPIRE_KEY);
    if (!expireTime) return false;
    
    // 현재 시간이 저장된 만료 시간보다 이전이면 true 반환
    return new Date().getTime() < Number(expireTime);
  } catch (error) {
    console.error('localStorage 불러오기 실패:', error);
    return false;
  }
};

/**
 * 알림 모달 제한 정보 삭제
 */
export const clearNotificationExpire = () => {
  try {
    localStorage.removeItem(import.meta.env.VITE_NOTIFICATION_EXPIRE_KEY);
  } catch (error) {
    console.error('localStorage 삭제 실패:', error);
  }
};
