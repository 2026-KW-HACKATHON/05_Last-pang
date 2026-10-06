import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/app/useAuth';
import { ROOT_KEYS } from '@/shared/constants/queryKeys';

import { fetchMyStore, registerStore, rotateStoreCode, updateStoreInfo } from './api';

import type { StoreInfoInput } from './schema';

export const storeKeys = { mine: [...ROOT_KEYS.store, 'mine'] as const };

export function useMyStore() {
  return useQuery({ queryKey: storeKeys.mine, queryFn: fetchMyStore });
}

export function useRegisterStore() {
  const { refreshRole } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerStore,
    onSuccess: async () => {
      await refreshRole(); // resident → owner로 바뀐 역할을 다시 읽어야 /owner 가드를 통과
      await queryClient.invalidateQueries({ queryKey: ROOT_KEYS.store });
    },
  });
}

export function useRotateStoreCode() {
  return useMutation({ mutationFn: rotateStoreCode });
}

export function useUpdateStoreInfo(storeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: StoreInfoInput) => updateStoreInfo(storeId, input),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ROOT_KEYS.store }),
  });
}
