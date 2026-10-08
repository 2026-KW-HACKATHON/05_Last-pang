// A5 · A5-1 자치회 리포트 (데스크톱 웹 1440). 개인을 알아볼 수 있는 정보는 담지 않는다
import { useState } from 'react';

import { Icon } from '@/features/owner/components/Icon';
import { formatMonthDay } from '@/features/owner/lib/format';
import { toKstDateString } from '@/shared/lib/time';

import { CouncilHeader } from '../components/CouncilHeader';
import { CouncilError, CouncilLoading, CouncilWarmingUp } from '../components/CouncilStates';
import { HeatmapCard } from '../components/HeatmapCard';
import { KpiCards } from '../components/KpiCards';
import { SummaryCard } from '../components/SummaryCard';
import { ZoneShareCard } from '../components/ZoneShareCard';
import { useCouncilReport } from '../hooks';

import type { CouncilReport } from '../api';

/** 최근 6개월 'YYYY-MM-01' */
function recentMonths(): string[] {
  const [year, month] = toKstDateString(new Date()).split('-').map(Number) as [number, number];
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(Date.UTC(year, month - 1 - index, 1));
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-01`;
  });
}

/** "10월 1일 ~ 10월 31일 · 매일 새벽 집계" / 쌓이는 중이면 "운영 9일째" */
function rangeText(report: CouncilReport | undefined, month: string): string {
  if (!report) {
    const [year, mon] = month.split('-').map(Number) as [number, number];
    const lastDay = new Date(Date.UTC(year, mon, 0)).getUTCDate();
    return `${mon}월 1일 ~ ${mon}월 ${lastDay}일 · 매일 새벽 집계`;
  }
  const tail = report.is_ready ? '매일 새벽 집계' : `운영 ${report.days_running}일째`;
  return `${formatMonthDay(report.month)} ~ ${formatMonthDay(report.range_end)} · ${tail}`;
}

export function CouncilReportPage() {
  const months = recentMonths();
  const [month, setMonth] = useState(months[0] ?? '2026-10-01');
  // 운영 2주 전이라도 발표·점검 때 지금까지 집계를 볼 수 있게
  const [isForced, setIsForced] = useState(false);
  const report = useCouncilReport(month);
  const data = report.data;
  const showsReport = data && (data.is_ready || isForced);

  return (
    <div className="min-h-dvh bg-cream text-ink">
      <CouncilHeader months={months} month={month} onMonthChange={setMonth} />
      <main className="mx-auto max-w-[1440px] px-10 pt-[34px] pb-10">
        <div className="flex items-start justify-between">
          <h1 className="text-[26px] font-bold">월계1동 상권 리포트</h1>
          <p className="flex items-center gap-2 pt-[18px] text-xs text-faint">
            <Icon name="shieldCheck" size={13} /> 개인을 알아볼 수 있는 정보는 담지 않아요
          </p>
        </div>
        <p className="mt-1 text-[13px] text-muted">{rangeText(data, month)}</p>

        <div className="mt-4">
          {report.isPending && <CouncilLoading />}
          {report.isError && <CouncilError onRetry={() => void report.refetch()} />}
          {data && !showsReport && (
            <CouncilWarmingUp report={data} onShowAnyway={() => setIsForced(true)} />
          )}
          {showsReport && (
            <div className="space-y-[15px]">
              <KpiCards kpis={data.kpis} />
              <div className="grid grid-cols-[601fr_739fr] gap-5">
                <ZoneShareCard zones={data.zones} />
                <HeatmapCard cells={data.heatmap} />
              </div>
              <SummaryCard report={data} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
