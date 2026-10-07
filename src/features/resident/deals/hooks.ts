import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { ROOT_KEYS } from '@/shared/constants/queryKeys';
import type { ReportReason } from '@/shared/constants/policy';

import {
  claimCoupon,
  fetchDeal,
  fetchMyCouponForDeal,
  fetchRecommendedDeals,
  subscribeDealChanges,
} from './api';
import { createDealEvent, fetchMyDailyUsage, reportDeal } from './detailApi';

import type { DealDetail } from './types';

const LIST_REFETCH_MS = 30_000; // 남은 수량이 바뀌므로 목록은 30초마다 다시 읽는다 (화면 명세 S03)

export const dealKeys = {
  all: ROOT_KEYS.deals,
  // 좌표는 약 100m 단위로 묶어 키를 만든다. 몇 m 움직였다고 다시 읽지 않게
  list: (lat: number, lng: number, radiusM: number) =>
    [...ROOT_KEYS.deals, 'list', lat.toFixed(3), lng.toFixed(3), radiusM] as const,
  detail: (dealId: string) => [...ROOT_KEYS.deals, 'detail', dealId] as const,
  myCoupon: (dealId: string) => [...ROOT_KEYS.coupons, 'byDeal', dealId] as const,
  dailyUsage: () => [...ROOT_KEYS.coupons, 'dailyUsage'] as const,
};

export function useRecommendedDeals(lat: number, lng: number, radiusM: number, isEnabled: boolean) {
  return useQuery({
    queryKey: dealKeys.list(lat, lng, radiusM),
    queryFn: () => fetchRecommendedDeals(lat, lng, radiusM),
    enabled: isEnabled,
    refetchInterval: LIST_REFETCH_MS,
  });
}

/** 딜 상세 + 남은 수량 실시간 반영 (서버 값을 캐시에 덮어쓸 뿐 useState로 복사하지 않는다) */
export function useDeal(dealId: string) {
  const queryClient = useQueryClient();

  useEffect(
    () =>
      subscribeDealChanges(dealId, (fields) => {
        queryClient.setQueryData<DealDetail>(dealKeys.detail(dealId), (prev) =>
          prev ? { ...prev, ...fields } : prev,
        );
      }),
    [dealId, queryClient],
  );

  return useQuery({ queryKey: dealKeys.detail(dealId), queryFn: () => fetchDeal(dealId) });
}

export function useMyCouponForDeal(dealId: string) {
  return useQuery({
    queryKey: dealKeys.myCoupon(dealId),
    queryFn: () => fetchMyCouponForDeal(dealId),
  });
}

/** 오늘 쿠폰 사용 횟수. 쿠폰을 쓰면 coupons 키가 무효화되어 함께 갱신된다 */
export function useMyDailyUsage() {
  return useQuery({ queryKey: dealKeys.dailyUsage(), queryFn: fetchMyDailyUsage });
}

export function useReportDeal(dealId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reason, detail }: { reason: ReportReason; detail: string }) =>
      reportDeal(dealId, reason, detail),
    // 신고가 3건 모이면 딜이 멈출 수 있다
    onSuccess: () => queryClient.invalidateQueries({ queryKey: dealKeys.detail(dealId) }),
  });
}

export function useClaimCoupon(dealId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => claimCoupon(dealId),
    // 성공·실패 모두 수량이나 내 쿠폰이 바뀌었을 수 있다 (SOLD_OUT·ALREADY_CLAIMED)
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ROOT_KEYS.deals }),
        queryClient.invalidateQueries({ queryKey: ROOT_KEYS.coupons }),
      ]),
  });
}

/** 상세 조회(또는 푸시 클릭) 기록을 화면에 들어올 때 한 번만 남긴다 */
export function useRecordDealView(dealId: string, isFromPush: boolean) {
  useEffect(() => {
    createDealEvent(dealId, isFromPush ? 'push_click' : 'detail_view').catch(() => {
      // 통계용 기록이라 실패해도 사용자에게 알리지 않는다
    });
  }, [dealId, isFromPush]);
}
