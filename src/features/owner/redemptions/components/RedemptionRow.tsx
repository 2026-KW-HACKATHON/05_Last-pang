import { formatPrice } from '@/shared/lib/format';

import { Icon } from '../../components/Icon';
import { formatClock } from '../../lib/format';

import type { Redemption } from '../api';

/** O7 타임라인 한 줄 (가장 최근 건은 연분홍 + 왼쪽 크림슨 막대 + "방금") */
export function RedemptionRow({ item, isLatest }: { item: Redemption; isLatest: boolean }) {
  return (
    <li
      className={`relative flex items-center gap-4 overflow-hidden rounded-field p-4 ${isLatest ? 'bg-accent-tint' : 'border border-line'}`}
    >
      {isLatest && <span className="absolute inset-y-0 left-0 w-1 bg-accent" />}
      <span className="w-12 shrink-0 text-sm text-muted tabular-nums">
        {formatClock(item.usedAt)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5">
          <b className="font-mono text-xl tracking-[3px]">{item.confirmNumber}</b>
          <Icon name="checkCircle" size={16} className="text-success" />
          {isLatest && (
            <span className="rounded-pill bg-accent px-1.5 text-[11px] font-semibold text-white">
              ● 방금
            </span>
          )}
        </p>
        <p className="truncate text-[13px] text-muted">{item.dealTitle}</p>
      </div>
      <span className="text-right text-[15px] font-semibold">{formatPrice(item.dealPrice)}</span>
    </li>
  );
}
