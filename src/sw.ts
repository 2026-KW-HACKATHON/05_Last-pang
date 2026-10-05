/// <reference lib="webworker" />
// Service Worker. 이 브랜치에서는 빌드 결과물 캐시만 한다(오프라인이면 마지막 화면을 보여줌).
// 푸시 수신(push)과 알림 클릭(notificationclick)은 6-1 feat/pwa-web-push에서 이 파일에 더한다
import { precacheAndRoute } from 'workbox-precaching';

declare let self: ServiceWorkerGlobalScope;

// __WB_MANIFEST는 vite-plugin-pwa가 빌드할 때 캐시할 파일 목록으로 바꿔 넣는다
precacheAndRoute(self.__WB_MANIFEST);
