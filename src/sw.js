import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';

const PREFIX = import.meta.env.VITE_APP_NAME;

// --------------------------
// 정적 파일 캐싱
// --------------------------
precacheAndRoute(self.__WB_MANIFEST);

// --------------------------
// HTML 오프라인 대응
// --------------------------
registerRoute(
  ({request}) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: `${PREFIX}-html-cache`,
    networkTimeoutSeconds: 3
  })
);

// --------------------------
// 이미지 캐싱
// --------------------------
registerRoute(
  ({request}) => request.destination === 'image',
  new StaleWhileRevalidate({
    cacheName: `${PREFIX}-image-cache`,
    networkTimeoutSeconds: 3
  })
);

// --------------------------
// API 요청 캐싱(최소 동작 보장, GET을 제외한 나머지는 제외)
// --------------------------
registerRoute(
  ({request, url}) => url.origin === import.meta.env.VITE_SERVER_URL && request.method === 'GET',
  new StaleWhileRevalidate({
    cacheName: `${PREFIX}-api-cache`,
    networkTimeoutSeconds: 3
  })
);

// --------------------------
// 웹푸시 핸들러
// --------------------------
self.addEventListener('push', e => {
  const data = e.data.json();

  self.registration.showNotification(
    data.title,
    {
      body: data.message,
      icon: '/icons/bottari-icon-32.png',
      data: {
        targetUrl: data.data.targetUrl
      }
    }
  );
});

// --------------------------
// 웹푸시 클릭 이벤트
// --------------------------
self.addEventListener('notificationclick', e => {
  e.notification.close(); // 푸시 알림 창 닫기

  // 페이로드에서 백앤드가 전달해 준 전체 URL 추출
  const openUrl = e.notification.data.targetUrl;

  // Origin 획득
  const origin = self.location.origin;

  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    .then(clients => {
      // 앱에서 루트 도메인 탭이 있는지 확인
      const myClient = clients.find(client => client.url.startsWith(origin));

      // 재활용할 탭이 있다면 포커스 및 네비게이트처리
      if(myClient) {
        myClient.focus();
        return myClient.navigate(openUrl);
      }

      // 재활용할 탭이 없다면 새창으로 열기
      if(self.clients.openWindow) {
        return self.clients.openWindow(openUrl);
      }
    })
  );
});