import { COLOR_STYLES, GRID_END_MIN, GRID_START_MIN, HOUR_PX } from '../constants';
import { toHHMM } from '../time';

import type { Schedule } from '../types';

interface ScheduleBlockProps {
  schedule: Schedule;
  onClick: (schedule: Schedule) => void;
}

// 그리드 범위(8~22시) 밖은 잘라서 보여준다
export function ScheduleBlock({ schedule, onClick }: ScheduleBlockProps) {
  const startMin = Math.max(schedule.startMin, GRID_START_MIN);
  const endMin = Math.min(schedule.endMin, GRID_END_MIN);
  if (endMin <= startMin) return null;
  const style = COLOR_STYLES[schedule.color];

  return (
    <button
      type="button"
      data-block
      onClick={() => onClick(schedule)}
      aria-label={`${schedule.name} ${toHHMM(schedule.startMin)}~${toHHMM(schedule.endMin)} 고치기`}
      className={`absolute inset-x-px overflow-hidden rounded-[3px] px-1 pt-1 text-left ${style.block}`}
      style={{
        top: ((startMin - GRID_START_MIN) / 60) * HOUR_PX,
        height: ((endMin - startMin) / 60) * HOUR_PX,
      }}
    >
      <span className={`block text-[11px] leading-tight font-bold break-all ${style.text}`}>
        {schedule.name}
      </span>
      <span className={`block text-[10px] leading-tight opacity-80 ${style.text}`}>
        {toHHMM(schedule.startMin)}
      </span>
    </button>
  );
}
