import { z } from 'zod';

import { categorySchema } from '@/shared/lib/domainSchema';
const dealStatusSchema = z.enum(['active', 'closed']);

export const recommendedDealRowSchema = z.object({
  deal_id: z.string(),
  store_id: z.string(),
  store_name: z.string(),
  category: categorySchema,
  title: z.string(),
  original_price: z.number(),
  deal_price: z.number(),
  remaining_qty: z.number(),
  total_qty: z.number(),
  ends_at: z.string(),
  distance_m: z.number(),
});

export const dealRowSchema = z.object({
  id: z.string(),
  store_id: z.string(),
  title: z.string(),
  original_price: z.number(),
  deal_price: z.number(),
  starts_at: z.string(),
  ends_at: z.string(),
  total_qty: z.number(),
  remaining_qty: z.number(),
  coupon_ttl_min: z.number(),
  status: dealStatusSchema,
  stores: z.object({
    name: z.string(),
    category: categorySchema,
    address: z.string(),
    lat: z.number(),
    lng: z.number(),
  }),
});

export const myDealCouponRowSchema = z.object({
  id: z.string(),
  status: z.enum(['issued', 'used']),
  expires_at: z.string(),
});

export const claimResultSchema = z.object({
  coupon_id: z.string(),
  expires_at: z.string(),
});

export const dealLiveRowSchema = z.object({
  remaining_qty: z.number(),
  status: dealStatusSchema,
});
