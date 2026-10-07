// O8 리포트 — 쿠폰 사용 기록으로 한산한 시간 딜이 무엇을 가져왔는지 보여 준다 (매출은 할인가 합계 추정)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';

import { ApprovedStoreGate } from '../../components/ApprovedStoreGate';
import { Icon } from '../../components/Icon';
import { OwnerShell } from '../../components/OwnerShell';
import { Button } from '../../components/ui/Button';
import { EmptyCard } from '../../components/ui/EmptyCard';
import { IconButton } from '../../components/ui/IconButton';
import { NoticeBox } from '../../components/ui/NoticeBox';
import { ProfileButton } from '../../components/ui/ProfileButton';
import { RootHeader } from '../../components/ui/RootHeader';
import { Segmented } from '../../components/ui/Segmented';
import { formatHourKo, formatMonthDay } from '../../lib/format';
import { previousRange } from '../../lib/period';
import { DealPerformanceList } from '../components/DealPerformanceList';
import { HourlyChart } from '../components/HourlyChart';
import { KpiGrid } from '../components/KpiGrid';
import { periodRange, type ReportPeriod, useDealPerformance, useStoreReport } from '../hooks';

import type { MyStore } from '../../store/api';

export function ReportPage() {
  const navigate = useNavigate();
  return (
    <OwnerShell>
      <RootHeader
        title="리포트"
        roleLabel="사장님"
        right={
          <>
            <IconButton icon="bell" label="알림" onClick={() => navigate('/owner/notifications')} />
            <ProfileButton to="/owner/me" />
          </>
        }
      />
      <ApprovedStoreGate allowSuspended>
        {(store) => <ReportBody store={store} />}
      </ApprovedStoreGate>
    </OwnerShell>
  );
}

function ReportBody({ store }: { store: MyStore }) {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<ReportPeriod>('week');
  const range = periodRange(period);
  const previous = previousRange(range);
  const report = useStoreReport(range.from, range.to);
  const previousReport = useStoreReport(previous.from, previous.to);
  const performance = useDealPerformance(store.id, range.from, range.to);
  const peak = report.data?.byHour.reduce((best, item) => (item.count > best.count ? item : best), {
    hour: 15,
    count: 0,
  });

  return (
    <div className="space-y-4 px-5 pt-3">
      <Segmented
        value={period}
        onChange={setPeriod}
        options={[
          { value: 'today', label: '오늘' },
          { value: 'week', label: '7일' },
          { value: 'month', label: '30일' },
        ]}
      />
      <p className="flex items-center gap-1 text-[13px] text-muted">
        <Icon name="calendar" size={14} />
        {range.from === range.to
          ? formatMonthDay(range.from)
          : `${formatMonthDay(range.from)} ~ ${formatMonthDay(range.to)}`}{' '}
        기준
      </p>
      {report.isPending && <LoadingState />}
      {report.isError && <ErrorState error={report.error} onRetry={() => void report.refetch()} />}
      {report.data && <KpiGrid report={report.data} previous={previousReport.data} />}
      {report.data && report.data.usedCount === 0 && (
        <>
          <EmptyCard
            icon="chart"
            title="아직 쌓인 기록이 없어요"
            body="첫 딜을 올리고 손님이 쿠폰을 사용하면 시간대별 매출과 방문 손님 통계를 분석해 드려요."
            action={
              <Button size="md" onClick={() => navigate('/owner/deals/new')}>
                <Icon name="plus" size={16} /> 즉시딜 올리기
              </Button>
            }
          />
          <NoticeBox icon="bulb" title="동네 타임딜 꿀팁">
            마감 1~2시간 전에 알림과 함께 올리면 완판 소진율이 가장 높아요!
          </NoticeBox>
        </>
      )}
      {report.data && report.data.usedCount > 0 && (
        <>
          {peak && peak.count > 0 && (
            <div className="rounded-card bg-accent-tint p-4">
              <p className="flex items-center gap-1.5 text-sm font-semibold">
                <Icon name="sparkle" size={16} className="text-accent" /> 동네냠냠 인사이트
              </p>
              <p className="mt-2 text-[15px] font-semibold">
                <span className="text-accent">{formatHourKo(peak.hour)}</span>에 가장 많이 썼어요.
                이 시간에 반복딜을 걸어 보세요!
              </p>
            </div>
          )}
          <HourlyChart report={report.data} />
          {performance.data && performance.data.length > 0 && (
            <DealPerformanceList deals={performance.data} />
          )}
        </>
      )}
    </div>
  );
}
