// 카카오에서 돌아오는 곳 (C2). supabase 클라이언트가 ?code= 를 세션으로 바꾸면 역할에 맞는 첫 화면으로 보낸다
import { useEffect, useState } from 'react';

import { useAuth } from '@/app/useAuth';

import { CallbackStatus } from '../components/CallbackStatus';
import { usePostLoginRedirect } from '../usePostLoginRedirect';

const TIMEOUT_MS = 10_000;

export function AuthCallbackPage() {
  usePostLoginRedirect();
  const { session } = useAuth();
  const [isTimedOut, setIsTimedOut] = useState(false);
  // 카카오 동의 화면에서 "취소"하면 error=access_denied, 그 밖의 문제는 error_description이 붙는다
  const params = new URLSearchParams(window.location.search);
  const error = params.get('error');

  useEffect(() => {
    const timer = window.setTimeout(() => setIsTimedOut(true), TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, []);

  if (error === 'access_denied') return <CallbackStatus state="cancelled" />;
  if (error || (isTimedOut && !session)) return <CallbackStatus state="failed" />;
  return <CallbackStatus state="loading" />;
}
