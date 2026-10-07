import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/app/useAuth';

import { fetchHasAgreedTerms } from './api';
import { postLoginPath } from './postLogin';
import { takeAfterLogin } from './redirect';

/** 세션과 역할이 준비되면 알맞은 첫 화면으로 보낸다. 반환값: 이동 준비 중인지 */
export function usePostLoginRedirect(): { isRedirecting: boolean } {
  const { session, role, isLoading } = useAuth();
  const navigate = useNavigate();
  const userId = session?.user.id;

  useEffect(() => {
    if (isLoading || !userId) return;
    let isCancelled = false;
    const go = async () => {
      // 동의 여부를 못 읽어도 막지 않는다. 주민이면 동의 화면이 다시 확인한다
      const agreed =
        role === 'resident' || role === null
          ? await fetchHasAgreedTerms(userId).catch(() => false)
          : true;
      if (!isCancelled) navigate(postLoginPath(role, agreed, takeAfterLogin()), { replace: true });
    };
    void go();
    return () => {
      isCancelled = true;
    };
  }, [isLoading, userId, role, navigate]);

  // 세션이 있으면 곧 이동하므로 로그인 버튼 대신 로딩을 보인다
  return { isRedirecting: isLoading || Boolean(userId) };
}
