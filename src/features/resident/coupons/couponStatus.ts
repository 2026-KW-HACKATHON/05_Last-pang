import type { CouponStatus, MyCoupon } from './types';

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

/** 사장님이 눈으로 확인하는 번호. redeem_coupon의 upper(right(id, 4))와 같은 규칙 */
export const toConfirmNumber = (couponId: string) => couponId.slice(-4).toUpperCase();

export function splitCoupons(coupons: MyCoupon[], nowMs: number) {
  const available = coupons.filter((coupon) => toEffectiveStatus(coupon, nowMs) === 'issued');
  const past = coupons.filter((coupon) => toEffectiveStatus(coupon, nowMs) !== 'issued');
  return { available, past };
}
