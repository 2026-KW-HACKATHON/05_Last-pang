import { z } from 'zod';

import { fetchCurrentUserId } from '@/shared/lib/currentUser';
import { AppError, toAppError } from '@/shared/lib/errors';
import { unwrapRpc } from '@/shared/lib/rpc';
import { supabase } from '@/shared/lib/supabase';

import {
  claimResultSchema,
  dealLiveRowSchema,
  dealRowSchema,
  myDealCouponRowSchema,
  recommendedDealRowSchema,
} from './schema';

import type { ClaimResult, DealDetail, DealLiveFields, DealSummary, MyDealCoupon } from './types';

/** 반경 안 진행 중 딜. 위치는 계산에만 쓰고 저장하지 않는다 (컨벤션 10장) */
export async function fetchRecommendedDeals(lat: number, lng: number): Promise<DealSummary[]> {
  const { data, error } = await supabase.rpc('recommend_deals', { p_lat: lat, p_lng: lng });
  if (error) throw toAppError(error);
  const rows = z.array(recommendedDealRowSchema).safeParse(data);
  if (!rows.success) throw new AppError('UNKNOWN');
  return rows.data.map((row) => ({
    dealId: row.deal_id,
    storeId: row.store_id,
    storeName: row.store_name,
    category: row.category,
    title: row.title,
    originalPrice: row.original_price,
    dealPrice: row.deal_price,
    remainingQty: row.remaining_qty,
    totalQty: row.total_qty,
    endsAt: row.ends_at,
    distanceM: row.distance_m,
  }));
}

export async function fetchDeal(dealId: string): Promise<DealDetail> {
  const { data, error } = await supabase
    .from('deals')
    .select(
      'id, store_id, title, original_price, deal_price, starts_at, ends_at, total_qty, remaining_qty, coupon_ttl_min, status, stores(name, category, address, lat, lng)',
    )
    .eq('id', dealId)
    .maybeSingle();
  if (error) throw toAppError(error);
  // 없는 딜, 또는 승인이 취소된 가게의 딜(RLS가 숨김)
  if (!data) throw new AppError('NOT_FOUND');
  const row = dealRowSchema.safeParse(data);
  if (!row.success) throw new AppError('UNKNOWN');
  const { stores: store, ...deal } = row.data;
  return {
    id: deal.id,
    storeId: deal.store_id,
    storeName: store.name,
    category: store.category,
    address: store.address,
    storeLat: store.lat,
    storeLng: store.lng,
    title: deal.title,
    originalPrice: deal.original_price,
    dealPrice: deal.deal_price,
    startsAt: deal.starts_at,
    endsAt: deal.ends_at,
    totalQty: deal.total_qty,
    remainingQty: deal.remaining_qty,
    couponTtlMin: deal.coupon_ttl_min,
    status: deal.status,
  };
}

/** 사장님·운영자는 RLS상 다른 사람 쿠폰도 보이므로 본인 id로 거른다 (합의 1-3) */
export async function fetchMyCouponForDeal(dealId: string): Promise<MyDealCoupon | null> {
  const userId = await fetchCurrentUserId();
  const { data, error } = await supabase
    .from('coupons')
    .select('id, status, expires_at')
    .eq('deal_id', dealId)
    .eq('user_id', userId)
    .in('status', ['issued', 'used'])
    .maybeSingle();
  if (error) throw toAppError(error);
  if (!data) return null;
  const row = myDealCouponRowSchema.safeParse(data);
  if (!row.success) throw new AppError('UNKNOWN');
  return { id: row.data.id, status: row.data.status, expiresAt: row.data.expires_at };
}

export async function claimCoupon(dealId: string): Promise<ClaimResult> {
  const { data, error } = await supabase.rpc('claim_coupon', { p_deal_id: dealId });
  const result = unwrapRpc(data, error, claimResultSchema);
  return { couponId: result.coupon_id, expiresAt: result.expires_at };
}

/** 행동 기록은 실패해도 화면에 영향을 주지 않는다 (호출하는 쪽에서 오류를 무시) */
export async function createDealEvent(dealId: string, type: 'detail_view' | 'push_click') {
  const { error } = await supabase.rpc('log_deal_event', { p_deal_id: dealId, p_type: type });
  if (error) throw toAppError(error);
}

/** 남은 수량·종료를 실시간으로 받는다. 반환값은 구독 해제 함수 */
export function subscribeDealChanges(
  dealId: string,
  onChange: (fields: DealLiveFields) => void,
): () => void {
  const channel = supabase
    .channel(`deal-${dealId}`)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'deals', filter: `id=eq.${dealId}` },
      (payload) => {
        const row = dealLiveRowSchema.safeParse(payload.new);
        if (row.success)
          onChange({ remainingQty: row.data.remaining_qty, status: row.data.status });
      },
    )
    .subscribe();
  return () => {
    void supabase.removeChannel(channel);
  };
}
