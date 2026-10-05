// O8 리포트 — 쿠폰 사용 기록으로 한산한 시간 딜이 무엇을 가져왔는지 보여 준다 (매출은 할인가 합계 추정)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { formatPrice } from '@/shared/lib/format';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';

import { ApprovedStoreGate } from '../../components/ApprovedStoreGate';
import { Icon } from '../../components/Icon';
import { OwnerShell } from '../../components/OwnerTabBar';
import { Button, Card, Chip, PageTitle, StatusBlock } from '../../components/ui';
import { formatHourKo, formatMonthDay } from '../../lib/format';
import { periodRange, type ReportPeriod, useStoreReport } from '../hooks';

import type { StoreReport } from '../api';

const PERIODS: ReadonlyArray<{ value: ReportPeriod; label: string }> = [
  { value: 'today', label: '오늘' },
  { value: 'week', label: '7일' },
  { value: 'month', label: '30일' },
];
const CHART_HOURS = Array.from({ length: 13 }, (_, index) => index + 9); // 9시~21시

export function ReportPage() {
  return (
    <OwnerShell>
      <PageTitle>리포트</PageTitle>
      <ApprovedStoreGate>{() => <ReportBody />}</ApprovedStoreGate>
    </OwnerShell>
  );
}

function ReportBody() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<ReportPeriod>('week');
  const range = periodRange(period);
  const report = useStoreReport(range.from, range.to);

  return (
    <div className="space-y-5 px-5">
      <div>
        <div className="flex gap-2">
          {PERIODS.map((option) => (
            <Chip
              key={option.value}
              isSelected={period === option.value}
              onClick={() => setPeriod(option.value)}
            >
              {option.label}
            </Chip>
          ))}
        </div>
        <p className="mt-2 text-[13px] text-faint">
          {range.from === range.to
            ? formatMonthDay(range.from)
            : `${formatMonthDay(range.from)} ~ ${formatMonthDay(range.to)}`}
        </p>
      </div>

      {report.isPending && <LoadingState />}
      {report.isError && <ErrorState error={report.error} onRetry={() => void report.refetch()} />}
      {report.isSuccess && report.data.usedCount === 0 && (
        <StatusBlock
          pose="eat"
          title={'아직 쌓인 기록이 없어요'}
          body="첫 딜을 올려 보세요"
          action={
            <Button block onClick={() => navigate('/owner/deals/new')}>
              즉시딜 올리기
            </Button>
          }
        />
      )}
      {report.isSuccess && report.data.usedCount > 0 && <ReportDetail report={report.data} />}
    </div>
  );
}

function ReportDetail({ report }: { report: StoreReport }) {
  const peak = report.byHour.reduce(
    (best, item) => (item.count > best.count ? item : best),
    report.byHour[0] ?? { hour: 0, count: 0 },
  );
  const maxCount = Math.max(1, ...CHART_HOURS.map((hour) => report.byHour[hour]?.count ?? 0));

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <KpiTile label="쿠폰 사용" value={`${report.usedCount}건`} />
        <KpiTile
          label="예상 매출"
          value={formatPrice(report.estimatedRevenue)}
          caption="할인가 합계 기준 추정"
        />
        <KpiTile label="방문 손님" value={`${report.visitorCount}명`} />
        <KpiTile label="처음 온 손님" value={`${report.newVisitorCount}명`} />
      </div>

      <Card>
        <h2 className="text-[15px] font-semibold">시간대별 사용</h2>
        <div
          className="mt-5 flex h-36 items-end gap-1.5"
          role="img"
          aria-label={`가장 많이 쓴 시간 ${formatHourKo(peak.hour)}, ${peak.count}건`}
        >
          {CHART_HOURS.map((hour) => {
            const count = report.byHour[hour]?.count ?? 0;
            const isPeak = hour === peak.hour && count > 0;
            return (
              <div
                key={hour}
                className="flex h-full flex-1 flex-col items-center justify-end gap-1"
              >
                {isPeak && <span className="text-[11px] font-semibold text-accent">{count}건</span>}
                <div
                  className={`w-full rounded-t-[4px] ${isPeak ? 'bg-accent' : 'bg-accent/35'}`}
                  style={{ height: `${(count / maxCount) * 100}%`, minHeight: count > 0 ? 4 : 0 }}
                />
              </div>
            );
          })}
        </div>
        <div className="mt-1.5 flex gap-1.5 border-t border-line pt-1.5">
          {CHART_HOURS.map((hour) => (
            <span key={hour} className="flex-1 text-center text-[11px] text-faint tabular-nums">
              {hour % 3 === 0 ? hour : ''}
            </span>
          ))}
        </div>
      </Card>

      {peak.count > 0 && (
        <p className="flex items-start gap-2 text-[15px]">
          <Icon name="sparkle" size={20} className="shrink-0 text-accent-soft" />
          {formatHourKo(peak.hour)}에 가장 많이 썼어요. 이 시간에 반복딜을 걸어 보세요
        </p>
      )}
    </>
  );
}

function KpiTile({ label, value, caption }: { label: string; value: string; caption?: string }) {
  return (
    <Card>
      <p className="text-[13px] text-muted">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums">{value}</p>
      {caption && <p className="mt-0.5 text-xs text-faint">{caption}</p>}
    </Card>
  );
}
