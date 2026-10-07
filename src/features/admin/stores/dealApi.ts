// 운영자가 대신 올리는 즉시딜 (사장님 계정이 없는 시연용 가게). 하루 3개·시간 겹침 규칙은 사장님과 같다
import { z } from 'zod';

import { toAppError } from '@/shared/lib/errors';
import { unwrapRpc } from '@/shared/lib/rpc';
import { supabase } from '@/shared/lib/supabase';
import type { DealFormInput } from '@/features/owner/deals/schema';

export interface AdminDeal {
  id: string;
  title: string;
  dealPrice: number;
  originalPrice: number;
  startsAt: string;
  endsAt: string;
  totalQty: number;
  remainingQty: number;
  status: string;
}

/** 이 가게의 오늘 이후 딜 (운영자는 RLS상 모든 딜을 읽는다) */
export async function fetchStoreDeals(storeId: string): Promise<AdminDeal[]> {
  const since = new Date(Date.now() - 24 * 3_600_000).toISOString();
  const { data, error } = await supabase
    .from('deals')
    .select(
      'id, title, deal_price, original_price, starts_at, ends_at, total_qty, remaining_qty, status',
    )
    .eq('store_id', storeId)
    .gte('ends_at', since)
    .order('starts_at', { ascending: false });
  if (error) throw toAppError(error);
  return data.map((row) => ({
    id: row.id,
    title: row.title,
    dealPrice: row.deal_price,
    originalPrice: row.original_price,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    totalQty: row.total_qty,
    remainingQty: row.remaining_qty,
    status: row.status,
  }));
}

export async function createDealForStore(storeId: string, input: DealFormInput) {
  const { data, error } = await supabase.rpc('admin_create_deal', {
    p_store_id: storeId,
    p_title: input.title,
    p_original_price: input.originalPrice,
    p_deal_price: input.dealPrice,
    p_duration_min: input.durationMin,
    p_total_qty: input.totalQty,
    p_coupon_ttl_min: input.couponTtlMin,
  });
  return unwrapRpc(data, error, z.object({ deal_id: z.string(), push_targets: z.number() }));
}

export async function closeDealForStore(dealId: string) {
  const { data, error } = await supabase.rpc('admin_close_deal', { p_deal_id: dealId });
  return unwrapRpc(data, error, z.object({ deal_id: z.string() }));
}
