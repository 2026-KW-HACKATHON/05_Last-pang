import { useNavigate } from 'react-router-dom';

import { Icon } from '@/shared/ui/Icon';
import { Mascot } from '@/shared/ui/Mascot';

import { signInWithKakao } from '../api';
import { KakaoButton } from './KakaoButton';

// C2 카카오 로그인 처리 — 로그인 중 · 실패 · 취소
export function CallbackStatus({ state }: { state: 'loading' | 'failed' | 'cancelled' }) {
  const navigate = useNavigate();
  const goStart = () => navigate('/login', { replace: true });

  return (
    <main className="mx-auto flex min-h-dvh max-w-[480px] flex-col items-center justify-center px-8 text-center">
      {state === 'loading' && (
        <>
          <Mascot pose="wave" size={140} />
          <h1 className="mt-6 text-lg font-bold">카카오 계정으로 로그인하고 있어요</h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            처음이면 가입 화면으로, 가입했다면 홈으로 바로 이동해요.
          </p>
          <span className="mt-10 size-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </>
      )}
      {state === 'failed' && (
        <>
          <span className="flex size-[76px] items-center justify-center rounded-full bg-accent-tint text-accent">
            <Icon name="alertCircle" size={30} />
          </span>
          <h1 className="mt-6 text-lg font-bold">로그인하지 못했어요</h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            잠시 후 다시 시도해 주세요.
            <br />
            계속 안 되면 인터넷 연결을 확인해 주세요.
          </p>
          <button
            type="button"
            onClick={() => void signInWithKakao().catch(goStart)}
            className="mt-8 flex h-[52px] w-full items-center justify-center gap-2 rounded-[12px] bg-accent font-semibold text-white"
          >
            <Icon name="refresh" size={18} /> 다시 시도
          </button>
        </>
      )}
      {state === 'cancelled' && (
        <>
          <Mascot pose="phone" size={140} />
          <h1 className="mt-6 text-lg font-bold">로그인을 취소했어요</h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            동네냠냠은 카카오 계정으로 시작할 수 있어요.
            <br />
            언제든 다시 시작해 주세요.
          </p>
          <div className="mt-8 w-full">
            <KakaoButton
              label="카카오로 다시 시작하기"
              onClick={() => void signInWithKakao().catch(goStart)}
            />
          </div>
        </>
      )}
      {state !== 'loading' && (
        <button type="button" onClick={goStart} className="mt-4 text-sm text-muted">
          처음 화면으로
        </button>
      )}
    </main>
  );
}
