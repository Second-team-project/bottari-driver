import { useEffect, useState } from "react";
import { toast } from "sonner";
import axiosIns from "../api/axiosInstance.js";
import { isNotificationHidden, saveNotificationExpire } from "../utils/localStorageUtil.js";

export default function usePushNotifications() {
  // 권한 플래그
  // NotificationPermission: "default" | "denied" | "granted"
  // 유저가 권한 거부를 한 경우, 코드상으로는 재설정 불가능
  // 크롬의 경우 `chrome://settings/content/notifications`로 접속하여 직접 허용 설정 필요
  //      ↱ 브라우저 구독 여부 플래그
  const [isSubscribing, setIsSubscribing] = useState(false);
  //      ↱ 서비스 시작 전 모달 표시 방지 플래그
  const [isInit, setIsInit] = useState(false);
  //      ↱ 모달이 계속 표시되는 것을 방지하기 위한 체크 플래그
  const [isCheckedSubscribe, setIsCheckedSubscribe] = useState(false);

  useEffect(() => {
    // usePushNotifications 초기화
    async function init() {
      try {
        // 1. 24시간 다시 보지 않기 체크
        if (isNotificationHidden()) {
          setIsCheckedSubscribe(true);
          setIsInit(true);
          return;
        }

        // 서비스 워커 준비
        const registration = await navigator.serviceWorker.ready;
        
        // 브라우저에 등록 중인 구독 정보 획득
        const subscribing = await registration.pushManager.getSubscription();
        if(subscribing) {
          setIsSubscribing(true);
        }
        
      } catch(error) {
        console.log(error);
      } finally {
        setIsInit(true);
      }
    }
    init();
  }, []);

  // 권한 요청
  // Notification.requestPermission(): "default" | "denied" | "granted"
  // 유저가 권한 거부를 한 경우, 코드상으로는 재설정 불가능
  // 크롬의 경우 `chrome://settings/content/notifications`로 접속하여 직접 허용 설정 필요
  async function requestPermission() {
    try {
      // 1. 브라우저 알림 지원하는 경우
      if('Notification' in window) {
        // 1-1. default 인 경우 : 아무 처리도 안 한 기본 상태
        if(Notification?.permission === 'default') {
          // 허용이 아닌경우 처리               ↱ 브라우저 자체 권한 요청 팝업: 허용 → granted / 허용 안 함 -> denied
          const result = await Notification.requestPermission();
          
          // granted : 허용 외 - denied, default(닫기) → false
          if(result !== 'granted') {
            toast.error('알림 거부 시, 서비스 안내 알림을 받을 수 없습니다.');
            return false;
          // 허용한 경우 → true
          } else {
            return true;
          }

          // 1-2. denied 인 경우 : 알림 거부한 상태 → false
        } else if(Notification?.permission === 'denied') {
            toast.error('알림 거부 시, 서비스 안내 알림을 받을 수 없습니다. 알림을 받기 위해 차단을 해제해 주세요.');
            return false;

          // 1-3. default/denied 아닌 경우 : granted → true
        } else {
          return true;
        }
      
      // 2. Notification 지원하지 않는 경우
      } else {
        toast.error('알림을 지원하지 않는 브라우저입니다.');
        return false;
      }
    } catch(error) {
      console.error(error);
      throw error;
    }
  }

  // 구독 등록     
  async function subscribeUser() {
    try {
      // 1. 구독 중이 아니라면
      if(!isSubscribing) {
        //                        ↱ 알림 허용 : true / 거부, 디폴트 : false
        const isGranted = await requestPermission();

        // 1-1. 알림 거부/디폴트 → false : 처리 종료
        if(!isGranted) {
          return;
        }

        // 1-2. 알림 허용 → 서비스 워커 준비
        const registration = await navigator.serviceWorker.ready;

        // 서비스 워커에 구독 정보 등록      ↱ push service에 등록 방식 설정
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,  // 유저가 사용하는 필요 변수만 구독
          applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY  // 백엔드에서 만든 key
        });
  
        // subscription의 구조
        // {
        //   endpoint: 'https://fcm.googleapis.com/fcm/send/dFlTq11Ly-w:...',
        //   expirationTime: null,
        //   keys: {
        //     p256dh: 'BD9B5KMdQbwgG7...',
        //     auth: 'OL56CZS...'
        //   }
        // }
  
        const deviceInfo = {
          userAgent: navigator.userAgent,   // 브라우저/디바이스 정보
          language: navigator.language      // 언어 정보
        };
        
        // Backend에 구독 정보 등록 요청
        await axiosIns.post('/api/common/subscriptions', {subscription, deviceInfo});

        toast.success('알림이 허용되었습니다.');
      }
    } catch(error) {
      toast.error('알림 설정에 실패했습니다. 다시 시도해 주세요.')
      console.error("구독 실패: ", error);
    } finally {
      setIsCheckedSubscribe(true);
    }
  }

  // 모달 닫기 (다음 접속 시 다시 표시됨)
  function dismissModal() {
    setIsCheckedSubscribe(true);
  }

  // 오늘 하루 보지 않기 (24시간 동안 표시 방지)
  function dismissToday() {
    saveNotificationExpire();
    setIsCheckedSubscribe(true);
  }

  return {
    isInit,
    isSubscribing,
    isCheckedSubscribe,
    subscribeUser,
    dismissModal,
    dismissToday,
  }
}