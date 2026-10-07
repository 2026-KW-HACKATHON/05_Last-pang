import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/app/useAuth';
import { ROOT_KEYS } from '@/shared/constants/queryKeys';

import {
  deleteMyAccount,
  fetchMyStore,
  linkStoreByCode,
  registerStore,
  requestAddressChange,
  rotateStoreCode,
  updateStoreInfo,
  uploadBusinessLicense,
} from './api';

import type { StoreInfoInput } from './schema';

export const storeKeys = { mine: [...ROOT_KEYS.store, 'mine'] as const };

export function useMyStore() {
  return useQuery({ queryKey: storeKeys.mine, queryFn: fetchMyStore });
}

/** 신청·연결이 끝나면 역할(resident → owner)과 가게 캐시를 다시 읽는다 */
function useAfterStoreLinked() {
  const { refreshRole } = useAuth();
  const queryClient = useQueryClient();
  return async () => {
    await refreshRole();
    await queryClient.invalidateQueries({ queryKey: ROOT_KEYS.store });
  };
}

export function useRegisterStore() {
  const afterLinked = useAfterStoreLinked();
  return useMutation({ mutationFn: registerStore, onSuccess: afterLinked });
}

export function useLinkStoreByCode() {
  const afterLinked = useAfterStoreLinked();
  return useMutation({ mutationFn: linkStoreByCode, onSuccess: afterLinked });
}

export function useUploadBusinessLicense() {
  return useMutation({ mutationFn: uploadBusinessLicense });
}

export function useRotateStoreCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rotateStoreCode,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ROOT_KEYS.store }),
  });
}

export function useUpdateStoreInfo(storeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: StoreInfoInput) => updateStoreInfo(storeId, input),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ROOT_KEYS.store }),
  });
}

export function useRequestAddressChange() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: requestAddressChange,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ROOT_KEYS.store }),
  });
}

export function useDeleteMyAccount() {
  return useMutation({ mutationFn: deleteMyAccount });
}
