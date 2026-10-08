import { fetchCurrentUserId } from '@/shared/lib/currentUser';
import { env } from '@/shared/lib/env';
import { AppError, toAppError } from '@/shared/lib/errors';
import { supabase } from '@/shared/lib/supabase';

import type { PushPermission } from './types';

export const readPushPermission = (): PushPermission =>
  'Notification' in window && 'serviceWorker' in navigator
    ? Notification.permission
    : 'unsupported';

// VAPID 공개키(base64url)를 pushManager가 받는 바이트 배열로
const toApplicationServerKey = (base64Url: string) => {
  const base64 = (base64Url + '='.repeat((4 - (base64Url.length % 4)) % 4))
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
};

export async function savePushSubscription(subscription: PushSubscription): Promise<void> {
  const userId = await fetchCurrentUserId();
  const { endpoint, keys } = subscription.toJSON();
  if (!endpoint || !keys?.p256dh || !keys.auth) throw new AppError('UNKNOWN');
  const { error } = await supabase.from('push_subscriptions').upsert(
    {
      user_id: userId,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'endpoint' },
  );
  if (error) throw toAppError(error);
}

/**
 * 브라우저 권한을 묻고, 허용되면 이 기기를 구독해 저장한다. 결과 권한을 돌려준다.
 * VAPID 키가 아직 없으면(6-1 전) 권한만 받아 둔다
 */
export async function subscribePush(): Promise<PushPermission> {
  if (readPushPermission() === 'unsupported') return 'unsupported';
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return permission;
  await registerThisDevice();
  return permission;
}

// 권한이 이미 허용된 기기를 지금 로그인한 계정에 (다시) 묶는다. 권한 창은 띄우지 않는다
// 예: 키가 없을 때 권한만 받은 기기, 같은 폰에서 다른 계정으로 바꿔 로그인한 경우
async function registerThisDevice(): Promise<void> {
  if (!env.vapidPublicKey) return;
  const registration = await navigator.serviceWorker.ready;
  const subscription =
    (await registration.pushManager.getSubscription()) ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: toApplicationServerKey(env.vapidPublicKey),
    }));
  await savePushSubscription(subscription);
}

let hasSynced = false;
/** 앱을 열 때 한 번: 권한이 허용돼 있으면 이 기기 구독을 서버에 다시 저장한다 (실패해도 조용히) */
export async function syncPushSubscription(): Promise<void> {
  if (hasSynced || readPushPermission() !== 'granted') return;
  hasSynced = true;
  await registerThisDevice();
}
