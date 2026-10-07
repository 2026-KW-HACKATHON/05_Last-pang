import { useNavigate } from 'react-router-dom';

import { Icon } from '../../components/Icon';
import { Badge } from '../../components/ui/Badge';
import { formatTimeRange } from '../../lib/format';

import type { OwnerDeal } from '../api';

/** O3-1 "오늘 예정된 딜" 카드 */
export function ScheduledDealCard({ deal }: { deal: OwnerDeal }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate(`/owner/deals/${deal.id}`)}
      className="flex w-full items-center gap-3 rounded-card border border-line bg-surface p-4 text-left"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-field bg-gray text-muted">
        <Icon name="calendar" size={22} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex gap-1">
          <Badge>{deal.type === 'weekly' ? '반복딜' : '즉시딜'}</Badge>
          <Badge tone="dark">예정</Badge>
        </span>
        <span className="mt-1 block truncate text-base font-semibold">{deal.title}</span>
        <span className="flex items-center gap-1 text-[13px] text-faint">
          <Icon name="clock" size={13} />
          {formatTimeRange(deal.startsAt, deal.endsAt)}
        </span>
      </span>
      <Icon name="chevron" size={18} className="text-faint" />
    </button>
  );
}
