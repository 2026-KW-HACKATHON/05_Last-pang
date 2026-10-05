import { Navigate, Outlet } from 'react-router-dom';

import { LoadingState } from '@/shared/ui/LoadingState';

import { useAuth } from './useAuth';

// 로그인 안 했으면 /login 으로. 세션 확인 중에는 깜빡임 없이 로딩만 보여준다
export function RequireAuth() {
  const { session, isLoading } = useAuth();

  if (isLoading) return <LoadingState />;
  if (!session) return <Navigate to="/login" replace />;
  return <Outlet />;
}
