import { z } from 'zod';

import { categorySchema } from '@/shared/lib/domainSchema';

export const couponRowSchema = z.object({
  id: z.string(),
  deal_id: z.string(),
  status: z.enum(['issued', 'used', 'expired', 'canceled']),
  issued_at: z.string(),
  expires_at: z.string(),
  used_at: z.string().nullable(),
  deals: z.object({
    title: z.string(),
    original_price: z.number(),
    deal_price: z.number(),
    remaining_qty: z.number(),
    status: z.string(),
    close_reason: z.string().nullable(),
    sold_out_at: z.string().nullable(),
    stores: z.object({ name: z.string(), category: categorySchema }),
  }),
});

export const redeemResultSchema = z.object({
  used_at: z.string(),
  confirm_number: z.string(),
});

/** get_redeem_lock(): 잠금이 없으면 locked_until이 null */
export const redeemLockSchema = z.object({
  locked_until: z.string().nullable(),
  remaining_attempts: z.number(),
});
