// A5 · A5-1 자치회 리포트 (데스크톱 웹 1440). 개인을 알아볼 수 있는 정보는 담지 않는다
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Icon } from '@/features/owner/components/Icon';
import { Button } from '@/features/owner/components/ui/Button';
import { Mascot } from '@/shared/ui/Mascot';
import { formatMonthDay } from '@/features/owner/lib/format';
import { toKstDateString } from '@/shared/lib/time';

import { HeatmapCard } from '../components/HeatmapCard';
import { KpiCards } from '../components/KpiCards';
import { SummaryCard } from '../components/SummaryCard';
import { ZoneShareCard } from '../components/ZoneShareCard';
import { useCouncilReport } from '../hooks';

/** 최근 6개월 'YYYY-MM-01' */
function recentMonths(): string[] {
  const [year, month] = toKstDateString(new Date()).split('-').map(Number) as [number, number];
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(Date.UTC(year, month - 1 - index, 1));
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-01`;
  });
}

export function CouncilReportPage() {
  const months = recentMonths();
  const [month, setMonth] = useState(months[0] ?? '2026-10-01');
  // 운영 2주 전이라도 발표·점검 때 지금까지 집계를 볼 수 있게
  const [isForced, setIsForced] = useState(false);
  const report = useCouncilReport(month);
  const data = report.data;
  return (
    <div className="min-h-dvh bg-cream">
      <header className="flex h-16 items-center justify-between border-b border-line bg-surface px-10">
        <div className="flex items-center gap-6">
          <span className="text-xl font-extrabold text-accent">동네냠냠</span>
          <span className="rounded-pill bg-busy px-2.5 py-0.5 text-xs">자치회</span>
          <span className="border-b-2 border-accent py-5 font-semibold text-accent">리포트</span>
          <Link to="/admin/stores" className="text-muted">
            가게 승인·신고
          </Link>
        </div>
        <label className="flex items-center gap-2 rounded-field border border-line px-3 py-2 text-sm">
          <Icon name="calendar" size={16} />
          <select
            value={month}
            onChange={(event) => setMonth(event.target.value)}
            className="bg-transparent outline-none"
          >
            {months.map((value) => (
              <option key={value} value={value}>
                {value.slice(0, 4)}년 {Number(value.slice(5, 7))}월
              </option>
            ))}
          </select>
        </label>
      </header>
      <main className="mx-auto max-w-[1360px] space-y-6 px-10 py-8">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-[26px] font-bold">월계1동 상권 리포트</h1>
            <p className="text-sm text-muted">
              {data
                ? `${formatMonthDay(data.month)} ~ ${formatMonthDay(data.range_end)} · ${data.is_ready ? '매일 새벽 집계' : `운영 ${data.days_running}일째`}`
                : ' '}
            </p>
          </div>
          <p className="flex items-center gap-1 text-[13px] text-muted">
            <Icon name="shield" size={16} /> 개인을 알아볼 수 있는 정보는 담지 않아요
          </p>
        </div>
        {report.isPending && (
          <p className="flex items-center justify-center gap-2 rounded-card bg-surface py-24 text-muted">
            <span className="size-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />{' '}
            집계를 불러오고 있어요
          </p>
        )}
        {report.isError && (
          <div className="flex flex-col items-center gap-3 rounded-card bg-surface py-24 text-center">
            <span className="flex size-14 items-center justify-center rounded-pill bg-busy">
              <Icon name="wifiOff" size={26} />
            </span>
            <p className="text-lg font-bold">리포트를 불러오지 못했어요</p>
            <p className="text-sm text-muted">인터넷 연결을 확인하고 다시 시도해 주세요.</p>
            <Button size="md" onClick={() => void report.refetch()}>
              <Icon name="refresh" size={16} /> 다시 시도
            </Button>
          </div>
        )}
        {data && !data.is_ready && !isForced && (
          <div className="flex flex-col items-center rounded-card bg-surface py-16 text-center">
            <Mascot pose="rice" size={140} />
            <p className="mt-4 text-xl font-bold">데이터가 쌓이는 중이에요</p>
            <p className="mt-1 text-sm text-muted">
              믿을 만한 통계를 보여드리려면 2주 이상 운영 기록이 필요해요.
            </p>
            {data.ready_from && (
              <p className="text-sm text-muted">
                {formatMonthDay(data.ready_from)}부터 리포트를 볼 수 있어요.
              </p>
            )}
            <div className="mt-6 grid grid-cols-3 gap-8 text-sm">
              <p>
                지금까지 딜 <b className="block text-xl">{data.totals.deals}건</b>
              </p>
              <p>
                쿠폰 사용 <b className="block text-xl">{data.totals.used}건</b>
              </p>
              <p>
                참여 가게 <b className="block text-xl">{data.totals.stores}곳</b>
              </p>
            </div>
            <Button variant="text" onClick={() => setIsForced(true)}>
              그래도 지금까지 집계 보기
            </Button>
          </div>
        )}
        {data && (data.is_ready || isForced) && (
          <>
            <KpiCards kpis={data.kpis} />
            <div className="grid grid-cols-2 gap-6">
              <ZoneShareCard zones={data.zones} />
              <HeatmapCard cells={data.heatmap} />
            </div>
            <SummaryCard report={data} />
          </>
        )}
      </main>
    </div>
  );
}
