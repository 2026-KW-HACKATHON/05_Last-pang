import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ROOT_KEYS } from '@/shared/constants/queryKeys';

import {
  closeDeal,
  createInstantDeal,
  createDealRule,
  deleteDealRule,
  fetchDealCouponCounts,
  fetchDealRule,
  fetchDealRules,
  fetchMyActiveDeals,
  fetchTodayDealQuota,
  fetchPushTargetEstimate,
  fetchTodayScheduledDeals,
  setDealRuleActive,
  updateDealRule,
} from './api';

import type { DealFormInput, WeeklyDealInput } from './schema';

export const ownerDealKeys = {
  active: (storeId: string) => [...ROOT_KEYS.deals, 'owner', 'active', storeId] as const,
  counts: (dealIds: string[]) => [...ROOT_KEYS.deals, 'owner', 'counts', ...dealIds] as const,
  estimate: (hourKey: number) => [...ROOT_KEYS.deals, 'owner', 'estimate', hourKey] as const,
  scheduled: (storeId: string) => [...ROOT_KEYS.deals, 'owner', 'scheduled', storeId] as const,
  rules: (storeId: string) => [...ROOT_KEYS.deals, 'owner', 'rules', storeId] as const,
  rule: (ruleId: string) => [...ROOT_KEYS.deals, 'owner', 'rule', ruleId] as const,
};

export function useTodayDealQuota() {
  return useQuery({
    queryKey: [...ROOT_KEYS.deals, 'owner', 'quota'],
    queryFn: fetchTodayDealQuota,
  });
}

/** 성공 후 이동은 화면이 정한다 (완료 화면을 먼저 보여 주기 위해) */
export function useCreateInstantDeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: DealFormInput) => createInstantDeal(input),
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

export function useTodayScheduledDeals(storeId: string) {
  return useQuery({
    queryKey: ownerDealKeys.scheduled(storeId),
    queryFn: () => fetchTodayScheduledDeals(storeId),
    enabled: Boolean(storeId),
    refetchInterval: 60_000, // 시작 시각이 지나면 "진행 중"으로 옮겨 가도록
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

export function useDealRule(ruleId: string) {
  return useQuery({
    queryKey: ownerDealKeys.rule(ruleId),
    queryFn: () => fetchDealRule(ruleId),
    enabled: Boolean(ruleId),
  });
}

/** 수정·삭제 뒤에는 반복딜 목록과 이 규칙 캐시를 같이 비운다 (루트 deals 키 아래라 한 번에) */
export function useUpdateDealRule(ruleId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: WeeklyDealInput & { isActive: boolean }) => updateDealRule(ruleId, input),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ROOT_KEYS.deals }),
  });
}

export function useDeleteDealRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDealRule,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ROOT_KEYS.deals }),
  });
}
