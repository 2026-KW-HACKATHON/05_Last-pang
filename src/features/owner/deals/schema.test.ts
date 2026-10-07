import { describe, expect, it } from 'vitest';

import { calcDiscount, dealFormSchema, weeklyDealSchema } from './schema';

const validDeal = {
  title: '소금빵 2+1',
  originalPrice: 10500,
  dealPrice: 7000,
  totalQty: 10,
  durationMin: 120,
  couponTtlMin: 15,
};

describe('dealFormSchema', () => {
  it('정상 입력은 통과한다', () => {
    expect(dealFormSchema.safeParse(validDeal).success).toBe(true);
  });

  it('할인가가 정상가보다 같거나 크면 dealPrice 오류', () => {
    const result = dealFormSchema.safeParse({ ...validDeal, dealPrice: 10500 });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['dealPrice']);
  });

  it('수량 101개, 쿠폰 시간 25분은 거절한다', () => {
    expect(dealFormSchema.safeParse({ ...validDeal, totalQty: 101 }).success).toBe(false);
    expect(dealFormSchema.safeParse({ ...validDeal, couponTtlMin: 25 }).success).toBe(false);
  });

  it('제목 앞뒤 공백을 지우고, 빈 제목은 거절한다', () => {
    expect(dealFormSchema.parse({ ...validDeal, title: '  1+1  ' }).title).toBe('1+1');
    expect(dealFormSchema.safeParse({ ...validDeal, title: '   ' }).success).toBe(false);
  });
});

describe('weeklyDealSchema', () => {
  const validRule = {
    title: '저녁 할인',
    originalPrice: 9000,
    dealPrice: 8100,
    repeatDays: [1, 3],
    startTime: '17:00',
    endTime: '19:00',
    qty: 5,
    couponTtlMin: 20,
  };

  it('정상 입력은 통과한다', () => {
    expect(weeklyDealSchema.safeParse(validRule).success).toBe(true);
  });

  it('요일이 없거나 끝이 시작보다 빠르면 거절한다', () => {
    expect(weeklyDealSchema.safeParse({ ...validRule, repeatDays: [] }).success).toBe(false);
    const result = weeklyDealSchema.safeParse({ ...validRule, endTime: '16:30' });
    expect(result.error?.issues[0]?.path).toEqual(['endTime']);
  });
});

describe('calcDiscount', () => {
  it('할인율은 반올림, 아낀 금액은 차액', () => {
    expect(calcDiscount(10500, 7000)).toEqual({ percent: 33, saved: 3500 });
  });

  it('할인이 아니면 0', () => {
    expect(calcDiscount(1000, 1000)).toEqual({ percent: 0, saved: 0 });
    expect(calcDiscount(0, 0)).toEqual({ percent: 0, saved: 0 });
  });
});
