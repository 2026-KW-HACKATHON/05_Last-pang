import { z } from 'zod';

import { fetchCurrentUserId } from '@/shared/lib/currentUser';
import { AppError, toAppError } from '@/shared/lib/errors';
import { unwrapRpc } from '@/shared/lib/rpc';
import { supabase } from '@/shared/lib/supabase';

import { couponRowSchema, redeemResultSchema } from './schema';

import type { MyCoupon, RedeemResult } from './types';

const COUPON_COLUMNS =
  'id, deal_id, status, issued_at, expires_at, used_at, deals(title, original_price, deal_price, stores(name, category))';

const toMyCoupon = (row: z.infer<typeof couponRowSchema>): MyCoupon => ({
  id: row.id,
  dealId: row.deal_id,
  status: row.status,
  issuedAt: row.issued_at,
  expiresAt: row.expires_at,
  usedAt: row.used_at,
  storeName: row.deals.stores.name,
  category: row.deals.stores.category,
  title: row.deals.title,
  originalPrice: row.deals.original_price,
  dealPrice: row.deals.deal_price,
});

/** 사장님·운영자는 RLS상 다른 사람 쿠폰도 보이므로 본인 id로 거른다 (합의 1-3) */
export async function fetchMyCoupons(): Promise<MyCoupon[]> {
  const userId = await fetchCurrentUserId();
  const { data, error } = await supabase
    .from('coupons')
    .select(COUPON_COLUMNS)
    .eq('user_id', userId)
    .order('issued_at', { ascending: false });
  if (error) throw toAppError(error);
  const rows = z.array(couponRowSchema).safeParse(data);
  if (!rows.success) throw new AppError('UNKNOWN');
  return rows.data.map(toMyCoupon);
}

export async function fetchCoupon(couponId: string): Promise<MyCoupon> {
  const userId = await fetchCurrentUserId();
  const { data, error } = await supabase
    .from('coupons')
    .select(COUPON_COLUMNS)
    .eq('id', couponId)
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw toAppError(error);
  if (!data) throw new AppError('NOT_FOUND');
  const row = couponRowSchema.safeParse(data);
  if (!row.success) throw new AppError('UNKNOWN');
  return toMyCoupon(row.data);
}

/** 코드는 서버에서 해시와 비교만 한다. 틀리면 AppError(WRONG_CODE, 남은 횟수) */
export async function redeemCoupon(couponId: string, code: string): Promise<RedeemResult> {
  const { data, error } = await supabase.rpc('redeem_coupon', {
    p_coupon_id: couponId,
    p_code: code,
  });
  const result = unwrapRpc(data, error, redeemResultSchema);
  return { usedAt: result.used_at, confirmNumber: result.confirm_number };
}
