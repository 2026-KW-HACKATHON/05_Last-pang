/// <reference lib="webworker" />
// Service Worker. 이 브랜치에서는 빌드 결과물 캐시만 한다(오프라인이면 마지막 화면을 보여줌).
// 푸시 수신(push)과 알림 클릭(notificationclick)은 6-1 feat/pwa-web-push에서 이 파일에 더한다
import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';

declare let self: ServiceWorkerGlobalScope;

// registerType: 'autoUpdate'(vite.config.ts)와 짝. 새 배포가 있으면 기다리지 않고 바로 교체하고
// 열려 있는 화면도 새 Service Worker가 맡는다 — 없으면 시연 폰이 탭을 다 닫을 때까지 옛 버전을 보여준다
void self.skipWaiting();
clientsClaim();

// __WB_MANIFEST는 vite-plugin-pwa가 빌드할 때 캐시할 파일 목록으로 바꿔 넣는다
precacheAndRoute(self.__WB_MANIFEST);
