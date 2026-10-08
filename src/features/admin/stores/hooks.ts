import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ROOT_KEYS } from '@/shared/constants/queryKeys';
import type { DealFormInput } from '@/features/owner/deals/schema';

import {
  approveStore,
  approveStoreAddress,
  createAdminStore,
  deleteAdminStore,
  fetchAdminStore,
  fetchAdminStores,
  fetchApplications,
  fetchLicenseUrl,
  issueLinkCode,
  rotateStoreCodeForStore,
  suspendStore,
  unsuspendStore,
  updateAdminStore,
  type AdminStoreInput,
  type ApplicationTab,
  type StoreFilter,
} from './api';
import { closeDealForStore, createDealForStore, fetchStoreDeals } from './dealApi';
import {
  fetchDealPushStatus,
  fetchPushFunnel,
  fetchPushReadiness,
  sendDealPushNow,
  sendTestPushToMe,
} from './pushApi';

export const adminStoreKeys = {
  applications: (tab: ApplicationTab) => [...ROOT_KEYS.admin, 'applications', tab] as const,
  stores: (filter: StoreFilter, query: string) =>
    [...ROOT_KEYS.admin, 'stores', filter, query] as const,
  store: (storeId: string) => [...ROOT_KEYS.admin, 'store', storeId] as const,
  deals: (storeId: string) => [...ROOT_KEYS.admin, 'store-deals', storeId] as const,
  license: (path: string) => [...ROOT_KEYS.admin, 'license', path] as const,
  pushReadiness: () => [...ROOT_KEYS.admin, 'push-readiness'] as const,
  pushFunnel: (storeId: string) => [...ROOT_KEYS.admin, 'push-funnel', storeId] as const,
  dealPush: (dealId: string) => [...ROOT_KEYS.admin, 'deal-push', dealId] as const,
};

/** 운영자 쓰기가 끝나면 운영자 캐시 전체와 주민 딜 캐시를 비운다 (가게가 생기거나 없어지면 홈 목록도 바뀜) */
function useAdminMutation<TInput, TResult>(mutationFn: (input: TInput) => Promise<TResult>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ROOT_KEYS.admin });
      void queryClient.invalidateQueries({ queryKey: ROOT_KEYS.deals });
    },
  });
}

export function useApplications(tab: ApplicationTab) {
  return useQuery({
    queryKey: adminStoreKeys.applications(tab),
    queryFn: () => fetchApplications(tab),
    refetchInterval: 30_000,
  });
}

export function useAdminStore(storeId: string) {
  return useQuery({
    queryKey: adminStoreKeys.store(storeId),
    queryFn: () => fetchAdminStore(storeId),
    enabled: Boolean(storeId),
  });
}

export function useLicenseUrl(path: string | null) {
  return useQuery({
    queryKey: adminStoreKeys.license(path ?? ''),
    queryFn: () => fetchLicenseUrl(path ?? ''),
    enabled: Boolean(path),
    staleTime: 240_000, // 서명 주소는 5분 유효
  });
}

export function useAdminStores(filter: StoreFilter, query: string) {
  return useQuery({
    queryKey: adminStoreKeys.stores(filter, query),
    queryFn: () => fetchAdminStores(filter, query),
  });
}

export function useStoreDeals(storeId: string) {
  return useQuery({
    queryKey: adminStoreKeys.deals(storeId),
    queryFn: () => fetchStoreDeals(storeId),
    enabled: Boolean(storeId),
    refetchInterval: 30_000,
  });
}

export const useApproveStore = () => useAdminMutation(approveStore);
export const useApproveStoreAddress = () => useAdminMutation(approveStoreAddress);
export const useSuspendStore = () => useAdminMutation(suspendStore);
export const useUnsuspendStore = () => useAdminMutation(unsuspendStore);
export const useCreateAdminStore = () => useAdminMutation(createAdminStore);
export const useUpdateAdminStore = (storeId: string) =>
  useAdminMutation((input: AdminStoreInput) => updateAdminStore(storeId, input));
export const useDeleteAdminStore = () => useAdminMutation(deleteAdminStore);
export const useRotateStoreCodeForStore = () => useAdminMutation(rotateStoreCodeForStore);
export const useIssueLinkCode = () => useAdminMutation(issueLinkCode);
export const useCreateDealForStore = (storeId: string) =>
  useAdminMutation((input: DealFormInput) => createDealForStore(storeId, input));
export const useCloseDealForStore = () => useAdminMutation(closeDealForStore);

// ── 알림 시험 ──
export const usePushReadiness = () =>
  useQuery({ queryKey: adminStoreKeys.pushReadiness(), queryFn: fetchPushReadiness });
export const usePushFunnel = (storeId: string) =>
  useQuery({
    queryKey: adminStoreKeys.pushFunnel(storeId),
    queryFn: () => fetchPushFunnel(storeId),
  });
/** 발송 결과는 몇 초 사이에 바뀌므로 5초마다 다시 읽는다 */
export const useDealPushStatus = (dealId: string, isLive: boolean) =>
  useQuery({
    queryKey: adminStoreKeys.dealPush(dealId),
    queryFn: () => fetchDealPushStatus(dealId),
    refetchInterval: isLive ? 5_000 : false,
  });
export const useSendDealPushNow = () => useAdminMutation(sendDealPushNow);
export const useSendTestPushToMe = () => useAdminMutation(sendTestPushToMe);
