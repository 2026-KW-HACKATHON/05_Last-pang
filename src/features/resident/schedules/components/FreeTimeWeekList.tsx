import { WEEK_DAYS } from '../constants';
import { dowOf, formatFreeTime } from '../time';

import type { FreeTimeItem } from '../types';

interface FreeTimeWeekListProps {
  items: FreeTimeItem[];
  todayDow: number;
}

// 이번 주 비는 시간: 월~일 한 줄씩, 오늘은 강조
export function FreeTimeWeekList({ items, todayDow }: FreeTimeWeekListProps) {
  return (
    <ul className="-mx-4">
      {WEEK_DAYS.map((day) => {
        const isToday = day.dow === todayDow;
        const dayItems = items.filter((item) => dowOf(item.day) === day.dow);
        return (
          <li
            key={day.dow}
            className={`flex items-center gap-3 px-4 py-2 ${isToday ? 'bg-accent-tint' : ''}`}
          >
            <span className={`w-5 text-sm ${isToday ? 'font-bold text-accent' : 'text-muted'}`}>
              {day.label}
            </span>
            {dayItems.length === 0 ? (
              <span className="text-xs text-faint">30분 넘게 비는 시간이 없어요</span>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {dayItems.map((item) => (
                  <span
                    key={item.from}
                    className={`rounded-[8px] px-2 py-1 text-sm font-semibold tabular-nums ${
                      isToday ? 'bg-surface text-success' : 'bg-gray'
                    }`}
                  >
                    {formatFreeTime(item)}
                  </span>
                ))}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
