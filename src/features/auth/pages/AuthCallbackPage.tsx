// 카카오에서 돌아오는 곳. supabase 클라이언트가 ?code= 를 세션으로 바꾸면 역할에 맞는 첫 화면으로 보낸다
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '@/app/useAuth';
import { LoadingState } from '@/shared/ui/LoadingState';

import { usePostLoginRedirect } from '../usePostLoginRedirect';

const TIMEOUT_MS = 10_000;

export function AuthCallbackPage() {
  usePostLoginRedirect();
  const { session } = useAuth();
  const [isTimedOut, setIsTimedOut] = useState(false);
  // 카카오가 오류로 돌려보내면 ?error_description= 이 붙는다
  const providerError = new URLSearchParams(window.location.search).get('error_description');

  useEffect(() => {
    const timer = window.setTimeout(() => setIsTimedOut(true), TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, []);

  if (providerError || (isTimedOut && !session)) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-[480px] flex-col items-center justify-center px-6 text-center">
        <img src="/brand/mascot-map.webp" alt="" width={120} height={120} />
        <h1 className="mt-5 text-[22px] font-bold">로그인하지 못했어요</h1>
        <p className="mt-2 text-muted">{providerError ?? '잠시 후 다시 시도해 주세요.'}</p>
        <Link to="/login" replace className="mt-8 font-semibold text-accent underline">
          로그인 화면으로
        </Link>
      </main>
    );
  }
  return <LoadingState />;
}
