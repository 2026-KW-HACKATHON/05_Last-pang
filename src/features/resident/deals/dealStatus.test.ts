import { describe, expect, it } from 'vitest';

import { isClosingSoon, sortDeals, toDealPhase } from './dealStatus';

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
  endsAt: '2026-10-07T08:00:00Z',
  distanceM: 300,
};

describe('isClosingSoon', () => {
  it('남은 수량이 20% 이하면 마감임박', () => {
    expect(isClosingSoon(2, 10)).toBe(true);
    expect(isClosingSoon(3, 10)).toBe(false);
  });
  it('수량이 적은 딜도 마지막 1개는 마감임박, 0개는 아님', () => {
    expect(isClosingSoon(1, 3)).toBe(true);
    expect(isClosingSoon(0, 3)).toBe(false);
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
});
