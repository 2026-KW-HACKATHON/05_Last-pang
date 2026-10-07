// 공통 로그인 — 카카오 로그인 (+ 점검용 테스트 계정). 이미 로그인했으면 역할에 맞는 첫 화면으로
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { env } from '@/shared/lib/env';
import { toAppError } from '@/shared/lib/errors';
import { LoadingState } from '@/shared/ui/LoadingState';

import { signInWithKakao } from '../api';
import { TestLoginForm } from '../components/TestLoginForm';
import { usePostLoginRedirect } from '../usePostLoginRedirect';

export function LoginPage() {
  const { isRedirecting } = usePostLoginRedirect();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  if (isRedirecting) return <LoadingState />;

  const handleKakao = async () => {
    setIsPending(true);
    setError(null);
    try {
      await signInWithKakao(); // 성공하면 카카오 화면으로 넘어간다
    } catch (caught) {
      setError(toAppError(caught).message);
      setIsPending(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-dvh max-w-[480px] flex-col justify-center px-6 py-12 text-center">
      <img src="/brand/mascot-wave.webp" alt="" width={140} height={140} className="mx-auto" />
      <h1 className="mt-6 text-[26px] font-bold">동네냠냠</h1>
      <p className="mt-2 text-muted">우리 동네 한산한 시간, 지금 바로 할인</p>
      <button
        type="button"
        onClick={() => void handleKakao()}
        disabled={isPending}
        className="mt-10 h-[52px] w-full rounded-[12px] bg-[#FEE500] text-[16px] font-semibold text-black/85 disabled:opacity-60"
      >
        {isPending ? '카카오로 이동 중…' : '카카오로 시작하기'}
      </button>
      {error && <p className="mt-3 text-sm text-danger">{error}</p>}
      {env.isTestLoginEnabled && <TestLoginForm />}
      <p className="mt-8 text-xs text-faint">
        시작하면{' '}
        <Link to="/terms/service" className="underline">
          이용약관
        </Link>
        과{' '}
        <Link to="/terms/privacy" className="underline">
          개인정보 처리방침
        </Link>
        에 동의하게 돼요.
      </p>
    </main>
  );
}
