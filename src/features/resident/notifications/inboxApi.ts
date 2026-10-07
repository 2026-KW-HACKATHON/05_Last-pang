// R17 받은 알림: notifications(audience='resident')를 읽고 읽음 처리, 새 알림은 실시간으로 받는다
import { fetchCurrentUserId } from '@/shared/lib/currentUser';
import { AppError, toAppError } from '@/shared/lib/errors';
import { unwrapRpc } from '@/shared/lib/rpc';
import { supabase } from '@/shared/lib/supabase';

import { markReadResultSchema, notificationRowSchema } from './schema';

import type { NotificationRow } from './schema';
import type { ResidentNotification } from './types';
import type { RealtimeChannel } from '@supabase/supabase-js';

const KIND_LABELS: Record<string, string> = { deal: '할인', deal_start: '시작', notice: '공지' };

// "[할인] 가게명 딜 제목" → 분류 · 제목 (가게명은 따로 보여 주므로 뗀다)
function splitTitle(row: NotificationRow) {
  const match = /^\[(.+?)\]\s*(.*)$/.exec(row.title);
  const chipLabel = match?.[1] ?? KIND_LABELS[row.kind] ?? '알림';
  let rest = match?.[2] ?? row.title;
  const storeName = row.stores?.name;
  if (storeName && rest.startsWith(storeName)) rest = rest.slice(storeName.length).trim();
  return { chipLabel, title: row.deals?.title ?? rest };
}

const toNotification = (row: NotificationRow): ResidentNotification => ({
  id: row.id,
  ...splitTitle(row),
  storeName: row.stores?.name ?? null,
  link: row.link ?? (row.deal_id ? `/deals/${row.deal_id}` : '/'),
  isRead: row.read_at !== null,
  createdAt: row.created_at,
  deal: row.deals && {
    startsAt: row.deals.starts_at,
    endsAt: row.deals.ends_at,
    remainingQty: row.deals.remaining_qty,
    totalQty: row.deals.total_qty,
    status: row.deals.status,
  },
});

export async function fetchResidentNotifications(): Promise<ResidentNotification[]> {
  const userId = await fetchCurrentUserId();
  const { data, error } = await supabase
    .from('notifications')
    .select(
      'id, kind, title, link, deal_id, read_at, created_at, stores(name), deals(title, starts_at, ends_at, remaining_qty, total_qty, status)',
    )
    .eq('user_id', userId)
    .eq('audience', 'resident')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw toAppError(error);
  const rows = notificationRowSchema.array().safeParse(data);
  if (!rows.success) throw new AppError('UNKNOWN');
  return rows.data.map(toNotification);
}

/** ids가 없으면 모두 읽음 */
export async function markResidentNotificationsRead(ids?: number[]): Promise<void> {
  const { data, error } = await supabase.rpc('mark_notifications_read', { p_ids: ids });
  unwrapRpc(data, error, markReadResultSchema);
}

/** 내 알림이 새로 들어오면 onInsert. 반환값은 구독 해제 함수 */
export function subscribeNewNotifications(onInsert: () => void): () => void {
  let channel: RealtimeChannel | null = null;
  let isClosed = false;
  fetchCurrentUserId()
    .then((userId) => {
      if (isClosed) return;
      channel = supabase
        .channel(`resident-notifications-${userId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`,
          },
          onInsert,
        )
        .subscribe();
    })
    .catch(() => undefined); // 실시간은 보조 수단이라 실패해도 목록은 그대로 쓴다
  return () => {
    isClosed = true;
    if (channel) void supabase.removeChannel(channel);
  };
}
