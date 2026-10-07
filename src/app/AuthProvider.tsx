import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

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
  // 역할을 읽고 있는(또는 읽은) 사용자 id. 같은 사용자의 토큰 갱신에는 역할을 다시 읽지 않는다
  const roleUserIdRef = useRef<string | null>(null);

  const loadRole = useCallback(async (userId: string) => {
    let nextRole: Role | null = null;
    try {
      nextRole = await fetchMyRole(userId);
    } catch {
      // 역할을 못 읽으면 일반 화면으로 둔다. 사장님·운영자 화면은 가드와 RLS가 막는다
      nextRole = null;
    }
    // 읽는 사이에 로그아웃하거나 다른 계정으로 바뀌었으면 이전 사용자의 역할을 덮어쓰지 않는다
    if (roleUserIdRef.current !== userId) return;
    setRole(nextRole);
    setIsLoading(false);
  }, []);

  useEffect(
    () =>
      subscribeAuthChange((next) => {
        setSession(next);
        if (!next) {
          roleUserIdRef.current = null;
          setRole(null);
          setIsLoading(false);
          return;
        }
        if (next.user.id === roleUserIdRef.current) return;
        // 새로고침 없이 로그인(데모 로그인)하면 이미 isLoading이 false라서, 역할을 읽기 전에
        // RequireRole이 role null을 보고 /로 보내 버린다. 사용자가 바뀔 때마다 로딩으로 되돌린다
        roleUserIdRef.current = next.user.id;
        setIsLoading(true);
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
