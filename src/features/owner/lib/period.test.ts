import { describe, expect, it, vi } from 'vitest';

import { changePercent, kstTodayWindow, nextKstDate, previousRange } from './period';

vi.mock('@/shared/lib/supabase', () => ({ supabase: {} })); // 순수 함수만 시험 (네트워크 없음)
const { rankDealPerformance } = await import('../report/api');

describe('nextKstDate', () => {
  it('월말·연말을 넘긴다', () => {
    expect(nextKstDate('2026-09-30')).toBe('2026-10-01');
    expect(nextKstDate('2026-12-31')).toBe('2027-01-01');
  });
});

describe('kstTodayWindow', () => {
  it('UTC로 전날 밤이어도 한국 날짜 기준으로 자른다', () => {
    // 2026-10-05T16:30Z = 한국 10월 6일 01:30
    expect(kstTodayWindow(new Date('2026-10-05T16:30:00Z'))).toEqual({
      from: '2026-10-06T00:00:00+09:00',
      to: '2026-10-07T00:00:00+09:00',
    });
  });
});

describe('previousRange', () => {
  it('7일 기간의 바로 앞 7일', () => {
    expect(previousRange({ from: '2026-09-30', to: '2026-10-06' })).toEqual({
      from: '2026-09-23',
      to: '2026-09-29',
    });
  });
  it('하루 기간이면 어제', () => {
    expect(previousRange({ from: '2026-10-06', to: '2026-10-06' })).toEqual({
      from: '2026-10-05',
      to: '2026-10-05',
    });
  });
});

describe('changePercent', () => {
  it('증감률을 반올림한다', () => {
    expect(changePercent(23, 19)).toBe(21);
    expect(changePercent(10, 20)).toBe(-50);
  });
  it('지난 기간이 0이면 null', () => {
    expect(changePercent(5, 0)).toBeNull();
  });
});

describe('rankDealPerformance', () => {
  const row = (id: string, total: number, remaining: number) => ({
    id,
    title: id,
    starts_at: '2026-10-06T05:00:00Z',
    ends_at: '2026-10-06T07:00:00Z',
    total_qty: total,
    remaining_qty: remaining,
  });

  it('소진율 순, 같으면 많이 나간 순으로 3개까지. 하나도 안 나간 딜은 뺀다', () => {
    const ranked = rankDealPerformance([
      row('a', 10, 2), // 80%
      row('b', 15, 0), // 100% (15개)
      row('c', 5, 0), // 100% (5개)
      row('d', 10, 10), // 0%
      row('e', 10, 5), // 50%
    ]);
    expect(ranked.map((deal) => deal.id)).toEqual(['b', 'c', 'a']);
    expect(ranked[2]).toMatchObject({ claimedQty: 8, claimRate: 0.8 });
  });
});
