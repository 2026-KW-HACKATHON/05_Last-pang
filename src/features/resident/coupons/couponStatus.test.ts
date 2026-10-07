import { describe, expect, it } from 'vitest';

import { splitCoupons, toConfirmNumber, toEffectiveStatus } from './couponStatus';

import type { MyCoupon } from './types';

const coupon: MyCoupon = {
  id: '3f2a9c1e-0000-4000-8000-00000000a2dc2',
  dealId: 'deal',
  status: 'issued',
  issuedAt: '2026-10-07T05:00:00Z',
  expiresAt: '2026-10-07T05:15:00Z',
  usedAt: null,
  storeName: '가게',
  category: 'bakery',
  title: '소금빵',
  originalPrice: 10500,
  dealPrice: 7000,
};
const at = (iso: string) => new Date(iso).getTime();

describe('toEffectiveStatus', () => {
  it('만료 시각 전에는 issued, 지나면 expired', () => {
    expect(toEffectiveStatus(coupon, at('2026-10-07T05:14:59Z'))).toBe('issued');
    expect(toEffectiveStatus(coupon, at('2026-10-07T05:15:00Z'))).toBe('expired');
  });
  it('사용한 쿠폰은 시간이 지나도 used', () => {
    expect(toEffectiveStatus({ ...coupon, status: 'used' }, at('2026-10-08T00:00:00Z'))).toBe(
      'used',
    );
  });
});

describe('toConfirmNumber', () => {
  it('id 끝 4글자를 대문자로 (서버와 같은 규칙)', () => {
    expect(toConfirmNumber(coupon.id)).toBe('2DC2');
  });
});

describe('splitCoupons', () => {
  it('사용 가능과 지난 쿠폰으로 나눈다', () => {
    const used = { ...coupon, id: 'used', status: 'used' as const };
    const result = splitCoupons([coupon, used], at('2026-10-07T05:10:00Z'));
    expect(result.available.map((item) => item.id)).toEqual([coupon.id]);
    expect(result.past.map((item) => item.id)).toEqual(['used']);
  });
});
