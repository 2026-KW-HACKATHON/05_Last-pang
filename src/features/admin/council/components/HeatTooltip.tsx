import { DOW_LABELS, MIN_PEOPLE } from '../reportText';

import type { HeatCell } from '../api';

// HeatmapCard 격자 크기와 같아야 한다: 요일 칸 24px · 칸 44×30px · 간격 2px · 시간 줄 16px
const DAY_COL = 24;
const CELL_W = 44;
const CELL_H = 30;
const GAP = 2;
const HEAD_H = 16;

interface HeatTooltipProps {
  cell: HeatCell;
  mode: 'supply' | 'demand';
  isGap: boolean;
  isHidden: boolean;
}

/** 칸에 마우스를 올리면 그 칸 바로 아래(아래쪽 줄이면 위)에 뜨는 설명 */
export function HeatTooltip({ cell, mode, isGap, isHidden }: HeatTooltipProps) {
  const col = cell.hour - 9;
  const row = cell.dow - 1;
  const left = DAY_COL + GAP + col * (CELL_W + GAP);
  const top = HEAD_H + GAP + row * (CELL_H + GAP);
  const isAbove = row >= 5;
  const isRight = col >= 8;
  const people =
    cell.free_people > 0 && cell.free_people < MIN_PEOPLE
      ? `${MIN_PEOPLE}명 미만`
      : `${cell.free_people}명`;

  return (
    <div
      role="tooltip"
      className="pointer-events-none absolute z-10 w-max rounded-[8px] bg-ink px-3 py-2.5 text-xs leading-5 text-white shadow-lg"
      style={{
        left: isRight ? left + CELL_W : left,
        top: isAbove ? top - 6 : top + CELL_H + 6,
        transform: `translate(${isRight ? '-100%' : '0'}, ${isAbove ? '-100%' : '0'})`,
      }}
    >
      <p className="font-bold">
        {DOW_LABELS[cell.dow]} {cell.hour}시
      </p>
      <p>
        {mode === 'demand' ? `쿠폰 사용 ${cell.used}건` : `딜 ${cell.supply}건`} · 주민 한가한 시간{' '}
        {people}
      </p>
      {isHidden && <p className="text-accent-disabled">표본이 적어 수요 칸은 숨겼어요</p>}
      {!isHidden && isGap && <p className="text-accent-disabled">공급이 수요보다 많이 부족해요</p>}
    </div>
  );
}
