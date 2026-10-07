import { describe, expect, it } from 'vitest';

import { splitCoupons, toConfirmNumber, toDisplayStatus, toEffectiveStatus } from './couponStatus';

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
  dealRemainingQty: 0,
  dealStatus: 'active',
  dealCloseReason: null,
  dealSoldOutAt: '2026-10-07T05:00:00Z',
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

describe('toDisplayStatus', () => {
  it('남은 수량 0이어도 딜이 열려 있으면 받은 쿠폰은 쓸 수 있다', () => {
    expect(toDisplayStatus(coupon, at('2026-10-07T05:10:00Z'))).toBe('issued');
  });
  it('딜이 소진으로 닫히면 소진, 사용한 쿠폰은 그대로 used', () => {
    const closed = { ...coupon, dealStatus: 'closed', dealCloseReason: 'sold_out' };
    expect(toDisplayStatus(closed, at('2026-10-07T05:10:00Z'))).toBe('soldOut');
    expect(toDisplayStatus({ ...closed, status: 'used' }, at('2026-10-07T05:10:00Z'))).toBe('used');
  });
});
