import type { CouponDisplayStatus, CouponStatus, MyCoupon } from './types';

/** 만료 시각이 지났는데 cron(매분)이 아직 expired로 바꾸지 않은 쿠폰도 만료로 본다 */
export function toEffectiveStatus(
  coupon: Pick<MyCoupon, 'status' | 'expiresAt'>,
  nowMs: number,
): CouponStatus {
  if (coupon.status === 'issued' && new Date(coupon.expiresAt).getTime() <= nowMs) {
    return 'expired';
  }
  return coupon.status;
}

type DealState = Pick<MyCoupon, 'dealStatus' | 'dealCloseReason' | 'dealSoldOutAt' | 'expiresAt'>;

/**
 * 딜이 '수량 소진'으로 닫혔고, 그 시각이 쿠폰 만료 전이면 소진으로 본다 (R8-2).
 * 받은 쿠폰은 수량을 미리 잡아두므로 남은 수량 0만으로는 소진이라 하지 않는다
 */
export function isClosedBySoldOut(coupon: DealState): boolean {
  if (coupon.dealStatus !== 'closed' || coupon.dealCloseReason !== 'sold_out') return false;
  if (!coupon.dealSoldOutAt) return true;
  return new Date(coupon.dealSoldOutAt).getTime() <= new Date(coupon.expiresAt).getTime();
}

export function toDisplayStatus(coupon: MyCoupon, nowMs: number): CouponDisplayStatus {
  const status = toEffectiveStatus(coupon, nowMs);
  if (status !== 'used' && isClosedBySoldOut(coupon)) return 'soldOut';
  return status;
}

/** 사장님이 눈으로 확인하는 번호. redeem_coupon의 upper(right(id, 4))와 같은 규칙 */
export const toConfirmNumber = (couponId: string) => couponId.slice(-4).toUpperCase();

export function splitCoupons(coupons: MyCoupon[], nowMs: number) {
  const available = coupons.filter((coupon) => toDisplayStatus(coupon, nowMs) === 'issued');
  const past = coupons.filter((coupon) => toDisplayStatus(coupon, nowMs) !== 'issued');
  return { available, past };
}
