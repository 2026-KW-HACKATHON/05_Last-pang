import type { Category } from '@/shared/constants/domain';

export type CouponStatus = 'issued' | 'used' | 'expired';

export interface MyCoupon {
  id: string;
  dealId: string;
  status: CouponStatus;
  issuedAt: string;
  expiresAt: string;
  usedAt: string | null;
  storeName: string;
  category: Category;
  title: string;
  originalPrice: number;
  dealPrice: number;
}

export interface RedeemResult {
  usedAt: string;
  confirmNumber: string;
}
