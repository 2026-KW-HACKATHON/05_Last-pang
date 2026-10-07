import { GRID_END_MIN, GRID_START_MIN, HOUR_PX, SLOT_PX } from '../constants';
import { ScheduleBlock } from './ScheduleBlock';

import type { Schedule } from '../types';

interface DayColumnProps {
  dow: number;
  isToday: boolean;
  schedules: Schedule[];
  alertMinutes: number[]; // 오늘 칸에만 넘긴다
  onBlockClick: (schedule: Schedule) => void;
}

// 30분마다 가는 선, 정시는 진한 선
const GRID_LINES = {
  backgroundImage: `linear-gradient(to bottom, #ececec 1px, transparent 1px), linear-gradient(to bottom, #f4f4f4 1px, transparent 1px)`,
  backgroundSize: `100% ${HOUR_PX}px, 100% ${SLOT_PX}px`,
};

export function DayColumn({ dow, isToday, schedules, alertMinutes, onBlockClick }: DayColumnProps) {
  return (
    <div
      className={`relative border-l border-line ${isToday ? 'bg-accent-tint' : ''}`}
      style={GRID_LINES}
    >
      {schedules
        .filter((schedule) => schedule.days.includes(dow))
        .map((schedule) => (
          <ScheduleBlock key={schedule.id} schedule={schedule} onClick={onBlockClick} />
        ))}
      {alertMinutes
        .filter((minute) => minute >= GRID_START_MIN && minute <= GRID_END_MIN)
        .map((minute) => (
          <div
            key={minute}
            className="pointer-events-none absolute inset-x-0 z-10 h-0.5 bg-accent"
            style={{ top: ((minute - GRID_START_MIN) / 60) * HOUR_PX - 1 }}
          >
            <span className="absolute -top-[3px] -left-1 size-2 rounded-full bg-accent" />
          </div>
        ))}
    </div>
  );
}
