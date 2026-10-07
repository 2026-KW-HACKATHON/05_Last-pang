/// <reference lib="webworker" />
// Service Worker: 빌드 결과물 캐시(오프라인이면 마지막 화면) + 웹 푸시 수신·알림 클릭 (C10)
import { clientsClaim } from 'workbox-core';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

declare let self: ServiceWorkerGlobalScope;

// registerType: 'prompt'(vite.config.ts)와 짝. 새 버전은 C7 "업데이트가 준비됐어요" 띠에서
// 사용자가 "새로고침"을 눌렀을 때만 바꾼다 (쿠폰 코드를 입력하는 중에 화면이 바뀌지 않게)
self.addEventListener('message', (event) => {
  if ((event.data as { type?: string } | null)?.type === 'SKIP_WAITING') void self.skipWaiting();
});
clientsClaim();

// workbox 버전이 바뀌어 캐시 형식이 달라지면 남는 옛 precache를 지운다 (폰 저장 공간이 쌓이지 않게)
cleanupOutdatedCaches();

// __WB_MANIFEST는 vite-plugin-pwa가 빌드할 때 캐시할 파일 목록으로 바꿔 넣는다
precacheAndRoute(self.__WB_MANIFEST);

interface PushPayload {
  title?: string;
  body?: string;
  url?: string;
  tag?: string;
}

// send-push Edge Function이 보낸 JSON을 알림으로 띄운다
self.addEventListener('push', (event) => {
  let payload: PushPayload = {};
  try {
    payload = (event.data?.json() as PushPayload | undefined) ?? {};
  } catch {
    payload = { body: event.data?.text() };
  }
  event.waitUntil(
    self.registration.showNotification(payload.title ?? '동네냠냠', {
      body: payload.body ?? '',
      icon: '/icons/icon-192.png',
      badge: '/icons/favicon-48.png',
      tag: payload.tag,
      data: { url: payload.url ?? '/' },
    }),
  );
});

// 알림을 누르면 열린 창이 있으면 그 창을, 없으면 새 창으로 딜 상세(?src=push)를 연다
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data as { url?: string } | null)?.url ?? '/';
  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      const existing = windows.find((client) => 'focus' in client);
      if (existing) {
        await existing.focus();
        await existing.navigate(url);
        return;
      }
      await self.clients.openWindow(url);
    })(),
  );
});
