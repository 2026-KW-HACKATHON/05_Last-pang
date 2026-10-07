import { calculateDiscountRate } from '@/shared/lib/format';

import type { DealSort, DealSummary } from './types';

const CLOSING_SOON_RATIO = 0.2; // 남은 수량이 20% 이하면 "마감임박" (화면 명세 S03 [제안])

export const isClosingSoon = (remainingQty: number, totalQty: number) =>
  remainingQty > 0 && remainingQty <= Math.max(1, Math.floor(totalQty * CLOSING_SOON_RATIO));

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

export type DealPhase = 'upcoming' | 'active' | 'soldOut' | 'ended';

interface PhaseInput {
  status: 'active' | 'closed';
  startsAt: string;
  endsAt: string;
  remainingQty: number;
}

/** 딜 상세의 버튼·배너를 정하는 상태. 실제로 받을 수 있는지는 claim_coupon이 다시 확인한다 */
export function toDealPhase(deal: PhaseInput, nowMs: number): DealPhase {
  if (deal.status === 'closed' || nowMs >= new Date(deal.endsAt).getTime()) return 'ended';
  if (nowMs < new Date(deal.startsAt).getTime()) return 'upcoming';
  if (deal.remainingQty <= 0) return 'soldOut';
  return 'active';
}
