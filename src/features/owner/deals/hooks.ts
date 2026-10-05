import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ROOT_KEYS } from '@/shared/constants/queryKeys';

import {
  closeDeal,
  createDeal,
  createDealRule,
  fetchDealCouponCounts,
  fetchDealRules,
  fetchMyActiveDeals,
  fetchPushTargetEstimate,
  setDealRuleActive,
} from './api';

import type { DealFormInput, WeeklyDealInput } from './schema';

export const ownerDealKeys = {
  active: (storeId: string) => [...ROOT_KEYS.deals, 'owner', 'active', storeId] as const,
  counts: (dealIds: string[]) => [...ROOT_KEYS.deals, 'owner', 'counts', ...dealIds] as const,
  estimate: (hourKey: number) => [...ROOT_KEYS.deals, 'owner', 'estimate', hourKey] as const,
  rules: (storeId: string) => [...ROOT_KEYS.deals, 'owner', 'rules', storeId] as const,
};

/** 성공 후 이동은 화면이 정한다 (완료 화면을 먼저 보여 주기 위해) */
export function useCreateDeal(storeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: DealFormInput) => createDeal(storeId, input),
    // 주민 쪽 딜 캐시도 무효화. resident의 dealKeys를 import하지 않고 루트 키를 쓴다 (합의 2-12)
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ROOT_KEYS.deals }),
  });
}

export function useMyActiveDeals(storeId: string) {
  return useQuery({
    queryKey: ownerDealKeys.active(storeId),
    queryFn: () => fetchMyActiveDeals(storeId),
    enabled: Boolean(storeId),
    refetchInterval: 30_000,
  });
}

export function useDealCouponCounts(dealIds: string[]) {
  return useQuery({
    queryKey: ownerDealKeys.counts(dealIds),
    queryFn: () => fetchDealCouponCounts(dealIds),
    enabled: dealIds.length > 0,
    refetchInterval: 30_000,
  });
}

export function useCloseDeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: closeDeal,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ROOT_KEYS.deals }),
  });
}

export function usePushTargetEstimate() {
  const hourKey = new Date().getHours(); // 한 시간 단위로 캐시
  return useQuery({
    queryKey: ownerDealKeys.estimate(hourKey),
    queryFn: () => fetchPushTargetEstimate(new Date()),
  });
}

export function useDealRules(storeId: string) {
  return useQuery({
    queryKey: ownerDealKeys.rules(storeId),
    queryFn: () => fetchDealRules(storeId),
    enabled: Boolean(storeId),
  });
}

export function useCreateDealRule(storeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: WeeklyDealInput) => createDealRule(storeId, input),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ownerDealKeys.rules(storeId) }),
  });
}

export function useSetDealRuleActive(storeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { ruleId: string; isActive: boolean }) =>
      setDealRuleActive(input.ruleId, input.isActive),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ownerDealKeys.rules(storeId) }),
  });
}
