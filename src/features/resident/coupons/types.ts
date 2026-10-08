import type { Category } from '@/shared/constants/domain';

/** canceled = 딜이 사장님·운영자 종료 등으로 닫혀 서버가 취소한 쿠폰 */
export type CouponStatus = 'issued' | 'used' | 'expired' | 'canceled';

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
  /** 딜 쪽 상태 — 수량 소진(R8-2) 판단에 쓴다 */
  dealRemainingQty: number;
  dealStatus: string;
  dealCloseReason: string | null;
  dealSoldOutAt: string | null;
}

/** 화면에 보여줄 쿠폰 상태. soldOut은 딜이 '소진'으로 닫혀 쓸 수 없게 된 쿠폰 */
export type CouponDisplayStatus = CouponStatus | 'soldOut';

export interface RedeemResult {
  usedAt: string;
  confirmNumber: string;
}

export interface RedeemLock {
  lockedUntil: string | null;
  remainingAttempts: number;
}
