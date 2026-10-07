import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ROOT_KEYS } from '@/shared/constants/queryKeys';

import { fetchCoupon, fetchMyCoupons, fetchRedeemLock, redeemCoupon } from './api';

import type { MyCoupon } from './types';

export const couponKeys = {
  all: ROOT_KEYS.coupons,
  list: () => [...ROOT_KEYS.coupons, 'list'] as const,
  detail: (couponId: string) => [...ROOT_KEYS.coupons, 'detail', couponId] as const,
  lock: () => [...ROOT_KEYS.coupons, 'redeem-lock'] as const,
};

export function useMyCoupons() {
  return useQuery({ queryKey: couponKeys.list(), queryFn: fetchMyCoupons });
}

export function useCoupon(couponId: string) {
  return useQuery({ queryKey: couponKeys.detail(couponId), queryFn: () => fetchCoupon(couponId) });
}

export function useRedeemCoupon(couponId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => redeemCoupon(couponId, code),
    // 다시 읽기 전에 바로 사용 완료(R9) 화면으로 넘긴다
    onSuccess: (result) =>
      queryClient.setQueryData<MyCoupon>(couponKeys.detail(couponId), (prev) =>
        prev ? { ...prev, status: 'used', usedAt: result.usedAt } : prev,
      ),
    // 실패해도(COUPON_NOT_USABLE) 그사이 만료·사용됐을 수 있어 다시 읽는다
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ROOT_KEYS.coupons }),
        queryClient.invalidateQueries({ queryKey: ROOT_KEYS.deals }),
      ]),
  });
}

export function useRedeemLock() {
  return useQuery({ queryKey: couponKeys.lock(), queryFn: fetchRedeemLock, staleTime: 0 });
}
