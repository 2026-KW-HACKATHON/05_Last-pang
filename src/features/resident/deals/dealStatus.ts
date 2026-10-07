import { calculateDiscountRate } from '@/shared/lib/format';

import type { DealSort, DealStatus, DealSummary } from './types';

const ENDING_SOON_MS = 30 * 60_000; // 끝나기 30분 전부터 "마감임박" (피그마 R6 기본)

export const isEndingSoon = (endsAt: string, nowMs: number) => {
  const leftMs = new Date(endsAt).getTime() - nowMs;
  return leftMs > 0 && leftMs <= ENDING_SOON_MS;
};

const SORT_COMPARERS: Record<DealSort, (a: DealSummary, b: DealSummary) => number> = {
  distance: (a, b) => a.distanceM - b.distanceM,
  ending: (a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime(),
  discount: (a, b) =>
    calculateDiscountRate(b.originalPrice, b.dealPrice) -
    calculateDiscountRate(a.originalPrice, a.dealPrice),
};

/** 소진된 딜은 정렬과 상관없이 맨 뒤로 */
export function sortDeals(deals: DealSummary[], sort: DealSort): DealSummary[] {
  return [...deals].sort((a, b) => {
    const soldOutOrder = Number(a.remainingQty === 0) - Number(b.remainingQty === 0);
    return soldOutOrder || SORT_COMPARERS[sort](a, b);
  });
}

/** 위치를 모를 때의 "인기" 순: 준비 수량 대비 많이 나간 딜부터 (소진 딜 제외) */
export function pickPopularDeals(deals: DealSummary[], count: number): DealSummary[] {
  const claimedRatio = (deal: DealSummary) => (deal.totalQty - deal.remainingQty) / deal.totalQty;
  return deals
    .filter((deal) => deal.remainingQty > 0)
    .sort((a, b) => claimedRatio(b) - claimedRatio(a))
    .slice(0, count);
}

export type DealPhase = 'upcoming' | 'active' | 'soldOut' | 'paused' | 'ended';

interface PhaseInput {
  status: DealStatus;
  startsAt: string;
  endsAt: string;
  remainingQty: number;
}

/** 딜 상세의 버튼·배너를 정하는 상태. 실제로 받을 수 있는지는 claim_coupon이 다시 확인한다 */
export function toDealPhase(deal: PhaseInput, nowMs: number): DealPhase {
  if (deal.status === 'closed' || nowMs >= new Date(deal.endsAt).getTime()) return 'ended';
  if (deal.status === 'paused') return 'paused'; // 신고 3건으로 잠시 멈춤
  if (nowMs < new Date(deal.startsAt).getTime()) return 'upcoming';
  if (deal.remainingQty <= 0) return 'soldOut';
  return 'active';
}
