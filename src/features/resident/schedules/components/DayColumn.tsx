import { GRID_END_MIN, GRID_START_MIN, HOUR_PX, SLOT_PX } from '../constants';
import { ScheduleBlock } from './ScheduleBlock';

import type { FreeRange, Schedule } from '../types';

interface DayColumnProps {
  dow: number;
  isToday: boolean;
  schedules: Schedule[];
  freeRanges: FreeRange[]; // 이 요일의 비는 시간
  onBlockClick: (schedule: Schedule) => void;
}

// 30분마다 가는 선, 정시는 진한 선
const GRID_LINES = {
  backgroundImage: `linear-gradient(to bottom, #ececec 1px, transparent 1px), linear-gradient(to bottom, #f4f4f4 1px, transparent 1px)`,
  backgroundSize: `100% ${HOUR_PX}px, 100% ${SLOT_PX}px`,
};

export function DayColumn({ dow, isToday, schedules, freeRanges, onBlockClick }: DayColumnProps) {
  return (
    <div
      className={`relative border-l border-line ${isToday ? 'bg-accent-tint' : ''}`}
      style={GRID_LINES}
    >
      {freeRanges.map((free) => {
        const top = Math.max(free.startMin, GRID_START_MIN);
        const bottom = Math.min(free.endMin, GRID_END_MIN);
        if (bottom - top < 30) return null;
        return (
          <div
            key={free.startMin}
            aria-hidden
            className="pointer-events-none absolute inset-x-0.5 rounded-[3px] border border-dashed border-success/40 bg-success-tint/60"
            style={{
              top: ((top - GRID_START_MIN) / 60) * HOUR_PX,
              height: ((bottom - top) / 60) * HOUR_PX,
            }}
          />
        );
      })}
      {schedules
        .filter((schedule) => schedule.days.includes(dow))
        .map((schedule) => (
          <ScheduleBlock key={schedule.id} schedule={schedule} onClick={onBlockClick} />
        ))}
    </div>
  );
}
