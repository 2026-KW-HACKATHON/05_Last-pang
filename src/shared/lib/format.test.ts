import { describe, expect, it } from 'vitest';

import { calculateDiscountRate, formatDistance, formatPrice } from './format';

describe('formatPrice', () => {
  it('천 단위 쉼표와 "원"', () => {
    expect(formatPrice(4500)).toBe('4,500원');
    expect(formatPrice(12000)).toBe('12,000원');
  });
});

describe('formatDistance', () => {
  it('1km 미만은 m 단위 정수', () => {
    expect(formatDistance(320.4)).toBe('약 320m');
  });

  it('1km 이상은 km 소수점 한 자리', () => {
    expect(formatDistance(1234)).toBe('약 1.2km');
  });
});

describe('calculateDiscountRate', () => {
  it('정가 6,000원 → 4,200원은 30%', () => {
    expect(calculateDiscountRate(6000, 4200)).toBe(30);
  });

  it('반올림한다 (7,500원 → 4,900원은 34.7% → 35%)', () => {
    expect(calculateDiscountRate(7500, 4900)).toBe(35);
  });
});
