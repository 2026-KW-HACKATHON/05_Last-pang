import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { AppSplash } from './AppSplash';
import { useAuth } from './useAuth';

// 로그인 안 했으면 /login 으로. 들어오려던 주소는 ?redirect= 로 넘겨 로그인 뒤 돌아온다 (C3)
// 세션 확인 중에는 C1 시작 화면을 보여준다
export function RequireAuth() {
  const { session, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <AppSplash />;
  if (!session) {
    const target = location.pathname + location.search;
    const query = target === '/' ? '' : `?redirect=${encodeURIComponent(target)}`;
    return <Navigate to={`/login${query}`} replace />;
  }
  return <Outlet />;
}
