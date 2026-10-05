import { Navigate, Outlet } from 'react-router-dom';

import type { Role } from '@/features/auth/api';
import { LoadingState } from '@/shared/ui/LoadingState';

import { useAuth } from './useAuth';

interface RequireRoleProps {
  role: Exclude<Role, 'resident'>;
}

// 화면에서 막는 것은 편의일 뿐 보안이 아니다. 실제 권한은 RLS·RPC가 막는다 (컨벤션 10장)
export function RequireRole({ role }: RequireRoleProps) {
  const { role: myRole, isLoading } = useAuth();

  if (isLoading) return <LoadingState />;
  if (myRole !== role) return <Navigate to="/" replace />;
  return <Outlet />;
}
