import { GRID_END_MIN, GRID_START_MIN, HOUR_PX, WEEK_DAYS } from '../constants';
import { dayLabel, formatRange } from '../time';
import { useDragSelect } from '../useDragSelect';
import { DayColumn } from './DayColumn';

import type { DragRange, Schedule } from '../types';

interface TimetableGridProps {
  schedules: Schedule[];
  todayDow: number;
  alertMinutes: number[];
  onBlockClick: (schedule: Schedule) => void;
  onRangeSelect: (range: DragRange) => void;
}

const HOURS = Array.from(
  { length: (GRID_END_MIN - GRID_START_MIN) / 60 },
  (_, index) => GRID_START_MIN / 60 + index,
);
const BODY_HEIGHT = HOURS.length * HOUR_PX;

// 월~일 × 8~22시 주간 시간표. 빈 칸을 누르거나 끌면 일정 추가
export function TimetableGrid({
  schedules,
  todayDow,
  alertMinutes,
  onBlockClick,
  onRangeSelect,
}: TimetableGridProps) {
  const { bodyRef, range, handlers } = useDragSelect(onRangeSelect);
  const rangeColumn = range ? WEEK_DAYS.findIndex((day) => day.dow === range.dow) : -1;

  return (
    <section className="px-4" aria-label="주간 시간표">
      <div className="overflow-hidden rounded-[4px] border border-line text-xs select-none [-webkit-touch-callout:none]">
        <div className="grid grid-cols-[24px_repeat(7,1fr)] border-b border-line">
          <span />
          {WEEK_DAYS.map((day) => (
            <span
              key={day.dow}
              className={`border-l border-line py-1.5 text-center ${
                day.dow === todayDow ? 'bg-accent-tint font-bold text-accent' : 'text-muted'
              }`}
            >
              {day.label}
            </span>
          ))}
        </div>
        <div className="flex">
          <div className="w-6 shrink-0" aria-hidden="true">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="pt-0.5 pl-1 text-[10px] text-faint"
                style={{ height: HOUR_PX }}
              >
                {hour}
              </div>
            ))}
          </div>
          <div
            ref={bodyRef}
            className="relative grid flex-1 grid-cols-7"
            style={{ height: BODY_HEIGHT }}
            {...handlers}
          >
            {WEEK_DAYS.map((day) => (
              <DayColumn
                key={day.dow}
                dow={day.dow}
                isToday={day.dow === todayDow}
                schedules={schedules}
                alertMinutes={day.dow === todayDow ? alertMinutes : []}
                onBlockClick={onBlockClick}
              />
            ))}
            {range && rangeColumn >= 0 && (
              <div
                className="pointer-events-none absolute z-20 rounded-[3px] bg-accent"
                style={{
                  left: `${(rangeColumn / 7) * 100}%`,
                  width: `${100 / 7}%`,
                  top: ((range.startMin - GRID_START_MIN) / 60) * HOUR_PX,
                  height: ((range.endMin - range.startMin) / 60) * HOUR_PX,
                }}
              >
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-md bg-ink px-2 py-1 text-[11px] font-bold whitespace-nowrap text-white">
                  {dayLabel(range.dow)} {formatRange(range.startMin, range.endMin)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
        <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
        {range
          ? '손을 떼면 이름만 적으면 끝!'
          : '빨간 점 = 오늘 알림 시각 · 빈 칸을 꾹 눌러 끌면 일정 추가'}
      </p>
    </section>
  );
}
