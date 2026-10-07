// O10 사장님 알림 (notifications 테이블 audience='owner'). 서버 함수가 넣고 화면은 읽기·읽음 처리만
import { z } from 'zod';

import { fetchCurrentUserId } from '@/shared/lib/currentUser';
import { toAppError } from '@/shared/lib/errors';
import { unwrapRpc } from '@/shared/lib/rpc';
import { supabase } from '@/shared/lib/supabase';

export interface OwnerNotification {
  id: number;
  kind: string;
  title: string;
  body: string | null;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

export async function fetchOwnerNotifications(): Promise<OwnerNotification[]> {
  const userId = await fetchCurrentUserId();
  const { data, error } = await supabase
    .from('notifications')
    .select('id, kind, title, body, link, read_at, created_at')
    .eq('user_id', userId)
    .eq('audience', 'owner')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw toAppError(error);
  return data.map((row) => ({
    id: row.id,
    kind: row.kind,
    title: row.title,
    body: row.body,
    link: row.link,
    isRead: row.read_at !== null,
    createdAt: row.created_at,
  }));
}

/** ids가 없으면 모두 읽음 */
export async function markNotificationsRead(ids?: number[]): Promise<void> {
  const { data, error } = await supabase.rpc('mark_notifications_read', { p_ids: ids });
  unwrapRpc(data, error, z.object({ updated: z.number() }));
}
