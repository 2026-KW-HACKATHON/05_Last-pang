import { z } from 'zod';

import { toAppError } from '@/shared/lib/errors';
import { supabase } from '@/shared/lib/supabase';
import { toKstDateString } from '@/shared/lib/time';

export interface Redemption {
  couponId: string;
  confirmNumber: string;
  usedAt: string;
  dealTitle: string;
  dealPrice: number;
}

export type RedemptionRange = 'today' | 'yesterday' | 'week';

const DAY_MS = 86_400_000;
const kstDayStart = (date: Date) => `${toKstDateString(date)}T00:00:00+09:00`;

/** 범위 → [from, to) ISO. to가 없으면 지금까지 */
export function redemptionWindow(
  range: RedemptionRange,
  now = new Date(),
): { from: string; to?: string } {
  if (range === 'today') return { from: kstDayStart(now) };
  if (range === 'yesterday')
    return { from: kstDayStart(new Date(now.getTime() - DAY_MS)), to: kstDayStart(now) };
  return { from: kstDayStart(new Date(now.getTime() - 6 * DAY_MS)) };
}

const redemptionRowSchema = z.object({
  id: z.string(),
  used_at: z.string(),
  deals: z.object({ title: z.string(), deal_price: z.number() }),
});

/** 우리 가게에서 사용된 쿠폰 (최신순). 손님 이름은 가져오지 않는다 (RLS로도 막혀 있음) */
export async function fetchRedemptions(
  storeId: string,
  range: RedemptionRange,
): Promise<Redemption[]> {
  const window = redemptionWindow(range);
  let query = supabase
    .from('coupons')
    .select('id, used_at, deals!inner(title, deal_price, store_id)')
    .eq('status', 'used')
    .eq('deals.store_id', storeId)
    .gte('used_at', window.from);
  if (window.to) query = query.lt('used_at', window.to);
  const { data, error } = await query.order('used_at', { ascending: false });
  if (error) throw toAppError(error);
  return data.map((row) => {
    const redemption = redemptionRowSchema.parse(row);
    return {
      couponId: redemption.id,
      confirmNumber: redemption.id.slice(-4).toUpperCase(), // 2-4 confirm_number와 같은 규칙
      usedAt: redemption.used_at,
      dealTitle: redemption.deals.title,
      dealPrice: redemption.deals.deal_price,
    };
  });
}

/** coupons 변경 알림. RLS 때문에 다른 가게 쿠폰 변경은 오지 않는다 */
export function subscribeRedemptionChanges(storeId: string, onChange: () => void): () => void {
  const channel = supabase
    .channel(`redemptions-${storeId}`)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'coupons' }, onChange)
    .subscribe();
  return () => {
    void supabase.removeChannel(channel);
  };
}
