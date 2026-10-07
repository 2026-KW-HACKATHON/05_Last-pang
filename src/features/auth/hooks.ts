import { useMutation, useQueryClient } from '@tanstack/react-query';

import { signOut } from './api';

/** 로그아웃하면 이전 사용자의 캐시(쿠폰·프로필)가 다음 사용자에게 보이지 않게 모두 비운다 */
export function useSignOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: signOut,
    onSuccess: () => queryClient.clear(),
  });
}
