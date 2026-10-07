import { useState } from 'react';

import { biggestGaps, DOW_LABELS } from '../reportText';

import type { HeatCell } from '../api';

const HOURS = Array.from({ length: 12 }, (_, index) => index + 9);
const DAYS = [1, 2, 3, 4, 5, 6, 7];
const LEVELS = [
  'bg-gray',
  'bg-accent/15',
  'bg-accent/35',
  'bg-accent/60',
  'bg-accent/85',
  'bg-accent-pressed',
] as const;

/** A5 요일 × 시간대 히트맵 (공급 = 열린 딜, 수요 = 쿠폰 사용 + 한가한 주민) */
export function HeatmapCard({ cells }: { cells: HeatCell[] }) {
  const [mode, setMode] = useState<'supply' | 'demand'>('supply');
  const [hovered, setHovered] = useState<HeatCell | null>(null);
  const valueOf = (cell: HeatCell) =>
    mode === 'supply' ? cell.supply : cell.used + cell.free_people;
  const max = Math.max(1, ...cells.map(valueOf));
  const gaps = biggestGaps(cells);
  const cellAt = (dow: number, hour: number) =>
    cells.find((cell) => cell.dow === dow && cell.hour === hour);

  return (
    <section className="relative rounded-card bg-surface p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold">요일 × 시간대</h2>
          <p className="text-[13px] text-muted">
            {mode === 'supply' ? '딜이 열린 시간 (공급)' : '쿠폰 사용 · 주민 한가한 시간 (수요)'}
          </p>
        </div>
        <div className="flex rounded-pill bg-gray p-1 text-sm">
          {(['supply', 'demand'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              className={`rounded-pill px-3 py-1 ${mode === value ? 'bg-ink text-white' : 'text-muted'}`}
            >
              {value === 'supply' ? '공급' : '수요'}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-5 grid grid-cols-[28px_repeat(12,1fr)] gap-1 text-[11px] text-muted">
        <span />
        {HOURS.map((hour) => (
          <span key={hour} className="text-center">
            {String(hour).padStart(2, '0')}시
          </span>
        ))}
        {DAYS.map((dow) => (
          <div key={dow} className="contents">
            <span className="flex items-center">{DOW_LABELS[dow]}</span>
            {HOURS.map((hour) => {
              const cell = cellAt(dow, hour);
              const level = cell ? Math.min(5, Math.ceil((valueOf(cell) / max) * 5)) : 0;
              return (
                <span
                  key={hour}
                  onMouseEnter={() => cell && setHovered(cell)}
                  onMouseLeave={() => setHovered(null)}
                  className={`aspect-[1.6] rounded ${LEVELS[level]} ${gaps.has(`${dow}-${hour}`) ? 'ring-2 ring-ink' : ''}`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <p className="mt-4 flex items-center gap-2 text-xs text-muted">
        적음{' '}
        {LEVELS.slice(1).map((level) => (
          <span key={level} className={`inline-block size-3 rounded-sm ${level}`} />
        ))}{' '}
        많음
        <span className="ml-3 inline-block size-3 rounded-sm ring-2 ring-ink" /> 공급·수요 격차 큼
      </p>
      {hovered && (
        <div className="pointer-events-none absolute top-20 right-6 rounded-field bg-ink px-3 py-2 text-xs text-white">
          <p className="font-semibold">
            {DOW_LABELS[hovered.dow]} {hovered.hour}시
          </p>
          <p>
            딜 {hovered.supply}건 · 주민 한가한 시간 {hovered.free_people}명 · 사용 {hovered.used}건
          </p>
          {gaps.has(`${hovered.dow}-${hovered.hour}`) && <p>공급이 수요보다 많이 부족해요</p>}
        </div>
      )}
    </section>
  );
}
