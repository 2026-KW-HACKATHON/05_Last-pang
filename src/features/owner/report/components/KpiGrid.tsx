import { formatPrice } from '@/shared/lib/format';

import { Icon, type IconName } from '../../components/Icon';
import { changePercent } from '../../lib/period';

import type { StoreReport } from '../api';

interface KpiProps {
  label: string;
  value: string;
  unit?: string;
  caption: string;
  icon: IconName;
  isAccent?: boolean;
  isEmpty: boolean;
}

function Kpi({ label, value, unit, caption, icon, isAccent = false, isEmpty }: KpiProps) {
  return (
    <div className="rounded-card border border-line bg-surface p-4">
      <div className="flex items-start justify-between">
        <span className="text-[13px] text-muted">{label}</span>
        <Icon name={icon} size={18} className="text-faint" />
      </div>
      <p
        className={`mt-2 text-2xl font-bold tabular-nums ${isEmpty ? 'text-faint' : isAccent ? 'text-accent' : ''}`}
      >
        {value}
        {unit && <span className="ml-0.5 text-sm font-semibold">{unit}</span>}
      </p>
      <p className={`mt-1 text-xs ${caption.startsWith('↗') ? 'text-accent' : 'text-muted'}`}>
        {caption}
      </p>
    </div>
  );
}

/** O8 지표 2×2 (전주 대비 · 재방문 · 신규 유입률) */
export function KpiGrid({
  report,
  previous,
}: {
  report: StoreReport;
  previous: StoreReport | undefined;
}) {
  const isEmpty = report.usedCount === 0;
  const change = previous ? changePercent(report.usedCount, previous.usedCount) : null;
  const returning = report.visitorCount - report.newVisitorCount;
  return (
    <div className="grid grid-cols-2 gap-2">
      <Kpi
        label="쿠폰 사용"
        value={String(report.usedCount)}
        unit="건"
        icon="ticket"
        isEmpty={isEmpty}
        caption={
          change === null
            ? '지난 기간 기록 없음'
            : `${change >= 0 ? '↗' : '↘'} 지난 기간 대비 ${change >= 0 ? '+' : ''}${change}%`
        }
      />
      <Kpi
        label="예상 매출"
        value={formatPrice(report.estimatedRevenue).replace('원', '')}
        unit="원"
        icon="cash"
        isAccent
        isEmpty={isEmpty}
        caption="할인가 합계 기준 추정"
      />
      <Kpi
        label="방문 손님"
        value={String(report.visitorCount)}
        unit="명"
        icon="users"
        isEmpty={isEmpty}
        caption={`재방문 ${returning}명 포함`}
      />
      <Kpi
        label="처음 온 손님"
        value={String(report.newVisitorCount)}
        unit="명"
        icon="userPlus"
        isEmpty={isEmpty}
        caption={isEmpty ? '–' : `↗ 신규 유입률 ${Math.round(report.newVisitorRate * 100)}%`}
      />
    </div>
  );
}
