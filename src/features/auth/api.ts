import { z } from 'zod';

import { toAppError } from '@/shared/lib/errors';
import { supabase } from '@/shared/lib/supabase';

import type { Session } from '@supabase/supabase-js';

export const roleSchema = z.enum(['resident', 'owner', 'admin']);
export type Role = z.infer<typeof roleSchema>;

/** 세션이 바뀔 때마다 callback. 첫 호출(INITIAL_SESSION)에 현재 세션이 온다. 반환값은 구독 해제 함수 */
export function subscribeAuthChange(callback: (session: Session | null) => void): () => void {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session));
  return () => data.subscription.unsubscribe();
}

/** 운영자는 RLS상 profiles 전체를 읽을 수 있으므로 반드시 본인 id로 거른다 (합의 1-2) */
export async function fetchMyRole(userId: string): Promise<Role | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw toAppError(error);
  return data ? roleSchema.parse(data.role) : null;
}
