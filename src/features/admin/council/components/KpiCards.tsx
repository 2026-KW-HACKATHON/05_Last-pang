import type { CouncilReport } from '../api';

interface KpiDef {
  key: keyof CouncilReport['kpis'];
  label: string;
  unit: string;
  /** 증감을 %로 보여 줄지(건수 큰 것), 차이로 보여 줄지 */
  mode: 'diff' | 'percent' | 'pp';
}

const KPIS: KpiDef[] = [
  { key: 'deals', label: '딜 등록', unit: '건', mode: 'diff' },
  { key: 'claimed', label: '쿠폰 받음', unit: '장', mode: 'percent' },
  { key: 'used', label: '사용 완료', unit: '건', mode: 'percent' },
  { key: 'stores', label: '참여 가게', unit: '곳', mode: 'diff' },
  { key: 'first_visit_pct', label: '처음 온 손님 비율', unit: '%', mode: 'pp' },
];

function changeText(
  def: KpiDef,
  value: number | null,
  prev: number | null,
): { text: string; isUp: boolean } | null {
  if (value === null || prev === null || prev === 0) return null;
  const diff = value - prev;
  const isUp = diff >= 0;
  const arrow = isUp ? '▲' : '▼';
  if (def.mode === 'percent')
    return { text: `${arrow} ${Math.abs(Math.round((diff / prev) * 100))}%`, isUp };
  if (def.mode === 'pp') return { text: `${arrow} ${Math.abs(diff)}%p`, isUp };
  return { text: `${arrow} ${Math.abs(diff)}${def.unit}`, isUp };
}

/** A5 KPI 카드 5개 (지난달 대비) */
export function KpiCards({ kpis }: { kpis: CouncilReport['kpis'] }) {
  return (
    <div className="grid grid-cols-5 gap-4">
      {KPIS.map((def) => {
        const { value, prev } = kpis[def.key];
        const change = changeText(def, value, prev);
        return (
          <div key={def.key} className="rounded-card bg-surface p-5">
            <p className="text-sm text-muted">{def.label}</p>
            <p className="mt-2 text-[32px] leading-none font-bold tabular-nums">
              {value === null ? '–' : value.toLocaleString('ko-KR')}
              <span className="ml-1 text-sm font-semibold">{def.unit}</span>
            </p>
            <p className="mt-2 text-[13px] text-muted">
              지난달보다{' '}
              {change ? (
                <span className={change.isUp ? 'text-success' : 'text-danger'}>{change.text}</span>
              ) : (
                '–'
              )}
            </p>
          </div>
        );
      })}
    </div>
  );
}
