import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ROOT_KEYS } from '@/shared/constants/queryKeys';

import { approveStore, fetchStoresByStatus, type StoreStatus } from './api';

export const adminStoreKeys = {
  byStatus: (status: StoreStatus) => [...ROOT_KEYS.admin, 'stores', status] as const,
};

export function useStoresByStatus(status: StoreStatus) {
  return useQuery({
    queryKey: adminStoreKeys.byStatus(status),
    queryFn: () => fetchStoresByStatus(status),
  });
}

export function useApproveStore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveStore,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ROOT_KEYS.admin }),
  });
}
