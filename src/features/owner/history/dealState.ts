import type { BadgeTone } from '../components/ui/Badge';
import type { HistoryDeal } from './api';

/** 딜 상태 칩: LIVE · 예정 · 소진 · 종료 · 신고 중지 · 중지 (피그마 O11) */
export function dealStateOf(
  deal: HistoryDeal,
  now = Date.now(),
): { label: string; tone: BadgeTone } {
  if (deal.status === 'paused') return { label: '신고 확인 중', tone: 'danger' };
  if (deal.status === 'active' && new Date(deal.endsAt).getTime() > now) {
    return new Date(deal.startsAt).getTime() > now
      ? { label: '예정', tone: 'dark' }
      : { label: 'LIVE', tone: 'accent' };
  }
  if (deal.soldOutAt && deal.remainingQty === 0) return { label: '소진', tone: 'accent' };
  switch (deal.closeReason) {
    case 'report':
      return { label: '신고 중지', tone: 'neutral' };
    case 'owner':
    case 'admin':
    case 'store_suspended':
      return { label: '중지', tone: 'neutral' };
    default:
      return { label: '종료', tone: 'neutral' };
  }
}

/** 지난 딜 결과 한 줄: "10개 중 7개 사용 · 시간 종료" */
export function dealResultLine(deal: HistoryDeal): string {
  const used = `${deal.totalQty}개 중 ${deal.usedCount}개 사용`;
  switch (deal.closeReason) {
    case 'report':
      return `신고 확인 후 종료 · ${deal.usedCount}개 사용`;
    case 'owner':
      return `사장님이 중지 · ${deal.usedCount}개 사용`;
    case 'admin':
      return `운영자가 중지 · ${deal.usedCount}개 사용`;
    case 'store_suspended':
      return `가게 정지로 종료 · ${deal.usedCount}개 사용`;
    default:
      return deal.soldOutAt && deal.remainingQty === 0 ? `${used} · 소진` : `${used} · 시간 종료`;
  }
}
