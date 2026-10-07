import { WEEK_DAYS } from '../constants';
import { shortSlotLabel } from '../text';
import { dowOf } from '../time';

import type { AlertPreviewItem } from '../types';

interface AlertPreviewListProps {
  items: AlertPreviewItem[];
  todayDow: number;
}

// 이번 주 알림 미리 보기: 월~일 한 줄씩, 오늘은 강조 (R13-5)
export function AlertPreviewList({ items, todayDow }: AlertPreviewListProps) {
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
              <span className="text-xs text-faint">보낼 알림이 없어요</span>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {dayItems.map((item) => (
                  <span
                    key={item.slot}
                    className={`rounded-[8px] px-2 py-1 text-sm ${
                      isToday ? 'bg-surface text-accent' : 'bg-gray'
                    }`}
                  >
                    <b className="font-bold">{item.at}</b>{' '}
                    <span className={`text-xs ${isToday ? '' : 'text-muted'}`}>
                      {shortSlotLabel(item.slot)}
                    </span>
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
