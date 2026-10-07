// R1 가입 화면(서비스 소개 + 카카오로 시작하기) · C3 공유받은 딜 링크로 들어온 경우
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { AppSplash } from '@/app/AppSplash';
import { env } from '@/shared/lib/env';
import { toAppError } from '@/shared/lib/errors';

import { signInWithKakao } from '../api';
import { InstallTipCard } from '../components/InstallTipCard';
import { IntroCarousel } from '../components/IntroCarousel';
import { KakaoButton } from '../components/KakaoButton';
import { SharedDealCard } from '../components/SharedDealCard';
import { TestLoginForm } from '../components/TestLoginForm';
import { isSafePath, saveAfterLogin } from '../redirect';
import { usePostLoginRedirect } from '../usePostLoginRedirect';

export function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');
  const sharedDealId = isSafePath(redirect) ? /^\/deals\/([^/?]+)/.exec(redirect)?.[1] : undefined;
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const { isRedirecting } = usePostLoginRedirect();

  // 로그인 전에 돌아갈 곳을 적어 둔다 (테스트 계정 로그인도 같은 규칙)
  if (isSafePath(redirect)) saveAfterLogin(redirect);
  if (isRedirecting) return <AppSplash />;

  const start = async (afterLogin: string | null) => {
    if (afterLogin) saveAfterLogin(afterLogin);
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
    <main className="mx-auto flex min-h-dvh max-w-[480px] flex-col px-5 pt-10 pb-8">
      <header className="text-center">
        <img src="/brand/logo.webp" alt="동네냠냠" width={150} height={60} className="mx-auto" />
        <p className="mt-2 text-sm text-muted">한산한 가게와 한가한 주민의 시간을 이어줘요</p>
      </header>
      {sharedDealId ? (
        <SharedDealCard dealId={sharedDealId} />
      ) : (
        <div className="mt-6">
          <IntroCarousel />
          <InstallTipCard />
        </div>
      )}
      <div className="mt-auto pt-10 text-center">
        <KakaoButton
          label={sharedDealId ? '카카오로 시작하고 딜 보기' : '카카오로 시작하기'}
          isPending={isPending}
          onClick={() => void start(null)}
        />
        {error && <p className="mt-3 text-sm text-danger">{error}</p>}
        <button
          type="button"
          onClick={() => void start('/owner/signup')}
          className="mt-4 text-sm text-ink underline underline-offset-2"
        >
          사장님이신가요? 가게 등록하기
        </button>
        {env.isTestLoginEnabled && <TestLoginForm />}
        <p className="mt-6 text-xs leading-5 text-faint">
          시작하면 <Link to="/terms/service">이용약관</Link>과{' '}
          <Link to="/terms/privacy">개인정보 처리방침</Link>에 동의하는 것으로 보지 않아요.
          <br />
          동의는 다음 화면에서 받아요.
        </p>
      </div>
    </main>
  );
}
