import { Link } from 'react-router-dom';

import { Icon } from '../../components/Icon';
import { formatTimeRange } from '../../lib/format';

import type { DealPerformance } from '../api';

/** O8 인기 타임딜 성과 (소진율 순) */
export function DealPerformanceList({ deals }: { deals: DealPerformance[] }) {
  return (
    <section className="rounded-card border border-line bg-surface p-4">
      <div className="mb-2 flex justify-between">
        <h2 className="text-base font-semibold">인기 타임딜 성과</h2>
        <span className="text-[13px] text-muted">소진율 순</span>
      </div>
      <ul className="divide-y divide-line">
        {deals.map((deal) => (
          <li key={deal.id} className="flex items-center justify-between py-3">
            <div className="min-w-0">
              <p className="truncate font-semibold">{deal.title}</p>
              <p className="text-xs text-muted">
                {formatTimeRange(deal.startsAt, deal.endsAt)} 진행
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-accent">{Math.round(deal.claimRate * 100)}% 소진</p>
              <p className="text-xs text-muted">총 {deal.claimedQty}개 나감</p>
            </div>
          </li>
        ))}
      </ul>
      <Link
        to="/owner/deals/new"
        className="mt-1 flex items-center justify-between rounded-field bg-gray px-3 py-3 text-sm"
      >
        <span className="flex items-center gap-1.5">
          <Icon name="plus" size={16} className="text-accent" /> 오늘 유휴시간 타임딜 등록하기
        </span>
        <Icon name="chevron" size={16} className="text-faint" />
      </Link>
    </section>
  );
}
