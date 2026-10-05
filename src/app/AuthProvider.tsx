import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import { fetchMyRole, subscribeAuthChange, type Role } from '@/features/auth/api';

import { AuthContext } from './useAuth';

import type { Session } from '@supabase/supabase-js';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadRole = useCallback(async (userId: string) => {
    try {
      setRole(await fetchMyRole(userId));
    } catch {
      // 역할을 못 읽으면 일반 화면으로 둔다. 사장님·운영자 화면은 가드와 RLS가 막는다
      setRole(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(
    () =>
      subscribeAuthChange((next) => {
        setSession(next);
        if (!next) {
          setRole(null);
          setIsLoading(false);
          return;
        }
        // 이 콜백 안에서 다른 supabase 호출을 바로 기다리면 멈출 수 있어 다음 틱으로 미룬다 (구현서 9장)
        window.setTimeout(() => void loadRole(next.user.id), 0);
      }),
    [loadRole],
  );

  const refreshRole = useCallback(async () => {
    if (session) await loadRole(session.user.id);
  }, [session, loadRole]);

  const value = useMemo(
    () => ({ session, role, isLoading, refreshRole }),
    [session, role, isLoading, refreshRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
