import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // 서비스 워커 자동 업데이트 (사용자 개입 없이 최신 버전 유지)
      strategies: 'injectManifest', // 커스텀 서비스워커 사용 설정
      srcDir: 'src', // 커스텀 서비스워커 디렉토리
      filename: 'sw.js', // 사용자가 직접 작성한 서비스워커
      includeAssets: [ // 로컬 경로의 이미지 참조
        '/icons/*'
      ],
      manifest: {
        name: 'bottari-driver',  // PWA 애플리케이션의 이름 (설치 배너에 표시)
        short_name: 'bottari-driver', // 홈 화면 아이콘 아래에 표시될 이름
        description: '보따리 라는 웹의 짐 배송 서비스 기사 전용 앱', // 앱 설명
        theme_color: '#ffffff', // 브라우저 UI 테마 색상
        background_color: '#ffffff', //기본 배경색
        lang: 'ko',                     // 앱의 언어 설정 (기본 언어)
        display: 'standalone', // 브라우저 UI 없이 앱처럼 독립 실행
        orientation: 'portrait', // 뷰의 기본 방향 세로 설정
        start_url: '/', // PWA가 설치되어 있을 때, 홈화면에서 앱을 실행했을 때 처음 열릴 URL
        icons: [
          // 앱 아이콘 설정 (홈화면에 추가될 때 사용됨) `public\`에 배치된 파일일 것
          // Windows (Edge, Chrome on Desktop)의 경우, any 중 가장 첫번째 아이콘 사용
          // Android (Chrome)의 경우, `maskable`을 우선 사용
          // IOS의 경우, manifest를 무시하고, index.html의 <link rel="apple-touch-icon">만 사용
          {
            src: '/icons/bottari-icon-192.png', // 로컬 경로로 설정
            sizes: '192x192', // 아이콘 크기
            type: 'image/png',
            purpose: 'any' // purpose 속성을 설정하지 않으면 기본 `any`
          },
          {
            src: '/icons/bottari-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any' // purpose 속성을 설정하지 않으면 기본 `any`
          },
          {
            src: '/icons/bottari-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable' // 마스크 가능 속성 추가
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  preview: {
    port: 4173
  }
})
