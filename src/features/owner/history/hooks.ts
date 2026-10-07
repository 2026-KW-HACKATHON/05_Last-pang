import { useQuery } from '@tanstack/react-query';

import { ROOT_KEYS } from '@/shared/constants/queryKeys';

import {
  fetchDealCoupons,
  fetchDealHistory,
  fetchDealResult,
  fetchOwnerDeal,
  type HistoryTab,
} from './api';

export const historyKeys = {
  list: (tab: HistoryTab) => [...ROOT_KEYS.deals, 'owner', 'history', tab] as const,
  deal: (dealId: string) => [...ROOT_KEYS.deals, 'owner', 'deal', dealId] as const,
  coupons: (dealId: string) => [...ROOT_KEYS.coupons, 'owner', 'deal', dealId] as const,
  result: (dealId: string) => [...ROOT_KEYS.deals, 'owner', 'result', dealId] as const,
};

export function useDealHistory(tab: HistoryTab) {
  return useQuery({ queryKey: historyKeys.list(tab), queryFn: () => fetchDealHistory(tab) });
}

export function useOwnerDeal(dealId: string) {
  return useQuery({
    queryKey: historyKeys.deal(dealId),
    queryFn: () => fetchOwnerDeal(dealId),
    enabled: Boolean(dealId),
  });
}

/** 진행 중이면 30초마다 다시 (사용 내역이 실시간으로 쌓이도록) */
export function useDealCoupons(dealId: string, isLive: boolean) {
  return useQuery({
    queryKey: historyKeys.coupons(dealId),
    queryFn: () => fetchDealCoupons(dealId),
    enabled: Boolean(dealId),
    refetchInterval: isLive ? 30_000 : false,
  });
}

export function useDealResult(dealId: string, enabled: boolean) {
  return useQuery({
    queryKey: historyKeys.result(dealId),
    queryFn: () => fetchDealResult(dealId),
    enabled: Boolean(dealId) && enabled,
  });
}
