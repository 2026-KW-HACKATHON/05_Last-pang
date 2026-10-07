import { describe, expect, it } from 'vitest';

import { isEndingSoon, pickPopularDeals, sortDeals, toDealPhase } from './dealStatus';

import type { DealSummary } from './types';

const baseDeal: DealSummary = {
  dealId: 'a',
  storeId: 's',
  storeName: '가게',
  category: 'cafe',
  title: '딜',
  originalPrice: 10000,
  dealPrice: 9000,
  remainingQty: 5,
  totalQty: 10,
  startsAt: '2026-10-07T05:00:00Z',
  endsAt: '2026-10-07T08:00:00Z',
  couponTtlMin: 15,
  distanceM: 300,
};

describe('isEndingSoon', () => {
  const now = new Date('2026-10-07T07:40:00Z').getTime();
  it('끝나기 30분 전부터 마감임박, 끝난 딜은 아님', () => {
    expect(isEndingSoon('2026-10-07T08:00:00Z', now)).toBe(true);
    expect(isEndingSoon('2026-10-07T08:30:00Z', now)).toBe(false);
    expect(isEndingSoon('2026-10-07T07:30:00Z', now)).toBe(false);
  });
});

describe('pickPopularDeals', () => {
  it('많이 나간 순, 소진 딜은 빼고', () => {
    const hot = { ...baseDeal, dealId: 'hot', remainingQty: 1 };
    const soldOut = { ...baseDeal, dealId: 'soldOut', remainingQty: 0 };
    expect(pickPopularDeals([baseDeal, soldOut, hot], 5).map((deal) => deal.dealId)).toEqual([
      'hot',
      'a',
    ]);
  });
});

describe('sortDeals', () => {
  const near = { ...baseDeal, dealId: 'near', distanceM: 100, dealPrice: 9500 };
  const far = { ...baseDeal, dealId: 'far', distanceM: 900, endsAt: '2026-10-07T06:00:00Z' };
  const soldOut = { ...baseDeal, dealId: 'soldOut', distanceM: 10, remainingQty: 0 };

  it('가까운 순, 소진된 딜은 맨 뒤', () => {
    expect(sortDeals([soldOut, far, near], 'distance').map((deal) => deal.dealId)).toEqual([
      'near',
      'far',
      'soldOut',
    ]);
  });
  it('마감 임박 순과 할인 많은 순', () => {
    expect(sortDeals([near, far], 'ending')[0].dealId).toBe('far');
    expect(sortDeals([near, far], 'discount')[0].dealId).toBe('far');
  });
});

describe('toDealPhase', () => {
  const deal = {
    status: 'active' as const,
    startsAt: '2026-10-07T05:00:00Z',
    endsAt: '2026-10-07T07:00:00Z',
    remainingQty: 3,
  };
  const at = (iso: string) => new Date(iso).getTime();

  it('시작 전·진행 중·종료', () => {
    expect(toDealPhase(deal, at('2026-10-07T04:59:00Z'))).toBe('upcoming');
    expect(toDealPhase(deal, at('2026-10-07T06:00:00Z'))).toBe('active');
    expect(toDealPhase(deal, at('2026-10-07T07:00:00Z'))).toBe('ended');
  });
  it('사장님이 닫은 딜은 시간과 상관없이 종료, 수량 0은 소진', () => {
    expect(toDealPhase({ ...deal, status: 'closed' }, at('2026-10-07T06:00:00Z'))).toBe('ended');
    expect(toDealPhase({ ...deal, remainingQty: 0 }, at('2026-10-07T06:00:00Z'))).toBe('soldOut');
  });
  it('신고로 멈춘 딜은 paused', () => {
    expect(toDealPhase({ ...deal, status: 'paused' }, at('2026-10-07T06:00:00Z'))).toBe('paused');
  });
});
