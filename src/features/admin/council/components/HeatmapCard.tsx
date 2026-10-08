import { useState } from 'react';

import { biggestGaps, DOW_LABELS, isHiddenCell } from '../reportText';
import { HeatTooltip } from './HeatTooltip';

import type { HeatCell } from '../api';

const HOURS = Array.from({ length: 12 }, (_, index) => index + 9);
const DAYS = [1, 2, 3, 4, 5, 6, 7];
const LEVELS = [
  'bg-accent-tint',
  'bg-accent-disabled',
  'bg-accent/45',
  'bg-accent/70',
  'bg-accent',
  'bg-accent-pressed',
] as const;

type Mode = 'supply' | 'demand';

/** A5 요일 × 시간대 히트맵 (공급 = 열린 딜, 수요 = 쿠폰 사용 + 한가한 주민) */
export function HeatmapCard({ cells }: { cells: HeatCell[] }) {
  const [mode, setMode] = useState<Mode>('supply');
  const [hovered, setHovered] = useState<HeatCell | null>(null);
  const valueOf = (cell: HeatCell) =>
    mode === 'supply' ? cell.supply : cell.used + cell.free_people;
  const max = Math.max(1, ...cells.map(valueOf));
  const gaps = biggestGaps(cells);
  const cellAt = (dow: number, hour: number) =>
    cells.find((cell) => cell.dow === dow && cell.hour === hour);

  return (
    <section className="relative rounded-card bg-surface px-6 pt-6 pb-5 ring-1 ring-line">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[17px] font-bold">요일 × 시간대</h2>
          <p className="mt-1.5 text-xs text-faint">
            {mode === 'supply' ? '딜이 열린 시간 (공급)' : '쿠폰 사용 · 주민 한가한 시간 (수요)'}
          </p>
        </div>
        <div
          role="tablist"
          className="flex h-[38px] w-[200px] items-center rounded-pill border border-line p-[3px] text-xs"
        >
          {(['supply', 'demand'] as const).map((value) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={mode === value}
              onClick={() => setMode(value)}
              className={`h-full flex-1 rounded-pill ${mode === value ? 'bg-ink font-bold text-white' : 'text-muted'}`}
            >
              {value === 'supply' ? '공급' : '수요'}
            </button>
          ))}
        </div>
      </div>

      <div
        className="relative mt-[18px] grid w-fit grid-cols-[24px_repeat(12,44px)] grid-rows-[16px] gap-[2px] text-xs text-faint"
        onMouseLeave={() => setHovered(null)}
      >
        <span />
        {HOURS.map((hour) => (
          <span key={hour} className="text-center">
            {String(hour).padStart(2, '0')}시
          </span>
        ))}
        {DAYS.map((dow) => (
          <div key={dow} className="contents">
            <span className="flex h-[30px] items-center">{DOW_LABELS[dow]}</span>
            {HOURS.map((hour) => {
              const cell = cellAt(dow, hour);
              const value = cell ? valueOf(cell) : 0;
              const level = value === 0 ? 0 : Math.min(5, Math.ceil((value / max) * 5));
              const hidden = cell ? isHiddenCell(cell, mode) : false;
              const isGap = gaps.has(`${dow}-${hour}`);
              return (
                <span
                  key={hour}
                  onMouseEnter={() => cell && setHovered(cell)}
                  className={`h-[30px] rounded-[4px] ${
                    hidden ? 'border border-dashed border-line bg-surface' : LEVELS[level]
                  } ${isGap ? 'ring-[1.5px] ring-ink ring-inset' : ''} ${
                    hovered === cell ? 'outline-2 outline-offset-1 outline-ink/30' : ''
                  }`}
                />
              );
            })}
          </div>
        ))}
        {hovered && (
          <HeatTooltip
            cell={hovered}
            mode={mode}
            isGap={gaps.has(`${hovered.dow}-${hovered.hour}`)}
            isHidden={isHiddenCell(hovered, mode)}
          />
        )}
      </div>

      <div className="mt-[14px] flex items-center justify-between text-xs text-faint">
        <p className="flex items-center gap-1.5">
          적음
          {LEVELS.map((level) => (
            <span key={level} className={`inline-block h-2.5 w-[22px] rounded-[2px] ${level}`} />
          ))}
          많음
        </p>
        <p className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-2.5 rounded-[2px] ring-[1.5px] ring-ink" /> 공급·수요
            격차 큼
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-2.5 rounded-[2px] border border-dashed border-faint" />{' '}
            비공개
          </span>
        </p>
      </div>
    </section>
  );
}
