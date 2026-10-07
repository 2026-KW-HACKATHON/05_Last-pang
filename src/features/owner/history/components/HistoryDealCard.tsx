import { useNavigate } from 'react-router-dom';

import { useNow } from '@/shared/hooks/useNow';

import { CategoryIcon } from '../../components/CategoryIcon';
import { Icon } from '../../components/Icon';
import { formatTimeLeft, formatTimeRange } from '../../lib/format';
import { dealResultLine } from '../dealState';
import { DealStateChip } from './DealStateChip';

import type { HistoryDeal, HistoryTab } from '../api';

interface HistoryDealCardProps {
  deal: HistoryDeal;
  tab: HistoryTab;
  category: string;
}

/** O11 딜 기록 카드 → O12 딜 상세 */
export function HistoryDealCard({ deal, tab, category }: HistoryDealCardProps) {
  const navigate = useNavigate();
  const now = useNow(60_000);
  const summary =
    tab === 'past'
      ? dealResultLine(deal)
      : tab === 'live'
        ? `${deal.totalQty}개 중 ${deal.usedCount}개 사용 · ${deal.claimedCount}명 받음`
        : `준비 수량 ${deal.totalQty}개`;
  return (
    <button
      type="button"
      onClick={() => navigate(`/owner/deals/${deal.id}`)}
      className="flex w-full items-center gap-3 rounded-card border border-line bg-surface p-4 text-left"
    >
      {deal.closeReason === 'report' ? (
        <span className="flex size-11 shrink-0 items-center justify-center rounded-pill bg-gray text-muted">
          <Icon name="pause" size={22} />
        </span>
      ) : (
        <CategoryIcon category={category} />
      )}
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2 text-[13px] text-muted">
          <DealStateChip deal={deal} />
          {formatTimeRange(deal.startsAt, deal.endsAt)}
          {tab === 'live' && ` · ${formatTimeLeft(deal.endsAt, now)}`}
        </span>
        <span className="mt-1 block truncate text-base font-semibold">{deal.title}</span>
        <span className="block text-[13px] text-muted">{summary}</span>
      </span>
      <Icon name="chevron" size={18} className="text-faint" />
    </button>
  );
}
