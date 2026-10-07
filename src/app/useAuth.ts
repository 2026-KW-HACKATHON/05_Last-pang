import { createContext, useContext } from 'react';

import type { Role } from '@/features/auth/api';

import type { Session } from '@supabase/supabase-js';

// 로그인 상태는 앱에서 유일한 전역 상태다 (컨벤션 7장). 서버 데이터는 TanStack Query로
export interface AuthState {
  session: Session | null;
  role: Role | null;
  isLoading: boolean;
  refreshRole: () => Promise<void>;
}

// Provider 컴포넌트와 같은 파일에 두면 react-refresh 규칙이 경고하므로 Context·훅은 여기에 둔다
export const AuthContext = createContext<AuthState | null>(null);

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth는 AuthProvider 안에서만 사용');
  return context;
}
