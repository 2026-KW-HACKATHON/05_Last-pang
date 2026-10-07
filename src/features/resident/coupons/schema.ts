import { z } from 'zod';

import { categorySchema } from '@/shared/lib/domainSchema';

export const couponRowSchema = z.object({
  id: z.string(),
  deal_id: z.string(),
  status: z.enum(['issued', 'used', 'expired']),
  issued_at: z.string(),
  expires_at: z.string(),
  used_at: z.string().nullable(),
  deals: z.object({
    title: z.string(),
    original_price: z.number(),
    deal_price: z.number(),
    stores: z.object({ name: z.string(), category: categorySchema }),
  }),
});

export const redeemResultSchema = z.object({
  used_at: z.string(),
  confirm_number: z.string(),
});
