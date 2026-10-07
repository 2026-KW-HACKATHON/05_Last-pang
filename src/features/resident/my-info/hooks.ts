import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updatePushConsent } from '../profile/api';
import { profileKeys } from '../profile/hooks';
import { deleteMyAccount } from './api';

/** 알림 받기 끄기: 동의 시각만 지운다 (브라우저 권한은 앱이 거둘 수 없음) */
export function useTurnOffPushConsent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => updatePushConsent(false),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: profileKeys.all }),
  });
}

export function useDeleteMyAccount() {
  return useMutation({ mutationFn: deleteMyAccount });
}
