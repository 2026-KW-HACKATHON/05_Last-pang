import { Card } from '../../components/ui/Card';
import { formatHourKo } from '../../lib/format';

import type { StoreReport } from '../api';

const CHART_HOURS = Array.from({ length: 10 }, (_, index) => index + 11); // 11시~20시 (피그마 O8)

/** 시간대별 사용 막대 — 가장 많은 시간만 크림슨, 나머지 연분홍 */
export function HourlyChart({ report }: { report: StoreReport }) {
  const counts = CHART_HOURS.map((hour) => report.byHour[hour]?.count ?? 0);
  const maxCount = Math.max(1, ...counts);
  const peakHour = CHART_HOURS[counts.indexOf(Math.max(...counts))] ?? 15;
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold">시간대별 사용</h2>
          <p className="text-[13px] text-muted">손님들이 주로 찾아온 피크 시간대</p>
        </div>
        <span className="rounded-pill bg-gray px-2.5 py-1 text-xs text-muted">11시 - 20시</span>
      </div>
      <div
        className="mt-6 flex h-36 items-end gap-2"
        role="img"
        aria-label={`가장 많이 쓴 시간 ${formatHourKo(peakHour)}`}
      >
        {CHART_HOURS.map((hour, index) => {
          const count = counts[index] ?? 0;
          const isPeak = hour === peakHour && count > 0;
          return (
            <div key={hour} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              {isPeak && (
                <span className="rounded bg-ink px-1.5 py-0.5 text-[11px] font-semibold text-white">
                  {count}건
                </span>
              )}
              <div
                className={`w-full rounded-t-[6px] ${isPeak ? 'bg-accent' : 'bg-accent-disabled'}`}
                style={{ height: `${(count / maxCount) * 100}%`, minHeight: count > 0 ? 4 : 2 }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 flex gap-2 border-t border-line pt-1.5">
        {CHART_HOURS.map((hour) => (
          <span key={hour} className="flex-1 text-center text-[11px] text-faint tabular-nums">
            {hour}
          </span>
        ))}
      </div>
      <p className="mt-3 flex justify-between text-xs text-muted">
        <span>
          <span className="mr-1 inline-block size-2 rounded-sm bg-accent" />
          최다 방문 ({peakHour}:00 ~ {peakHour}:59)
        </span>
        <span>단위: 시간 (시)</span>
      </p>
    </Card>
  );
}
