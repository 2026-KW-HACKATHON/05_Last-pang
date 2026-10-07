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

/** 카카오 로그인. 카카오 → Supabase → /auth/callback 으로 돌아오면 PKCE 코드가 자동으로 세션이 된다 */
export async function signInWithKakao(): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
  if (error) throw toAppError(error);
}

/** 테스트 계정 로그인 (env.isTestLoginEnabled일 때만 화면에 보인다). 계정은 Supabase 대시보드에서 만든다 */
export async function signInWithTestAccount(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw toAppError(error);
}

/** 로그인 직후 어디로 보낼지 정하는 데 필요한 값. 본인 행만 읽는다 */
export async function fetchHasAgreedTerms(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('profiles')
    .select('agreed_terms_at')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw toAppError(error);
  return Boolean(data?.agreed_terms_at);
}

/** 로그아웃. 성공하면 subscribeAuthChange가 null 세션을 받아 로그인 화면으로 간다 */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw toAppError(error);
}
