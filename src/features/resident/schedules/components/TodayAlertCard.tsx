import { Link } from 'react-router-dom';

import { alertLabel } from '../text';
import { dayLabel, leadLabel } from '../time';

import type { AlertPreviewItem, Schedule } from '../types';

interface TodayAlertCardProps {
  todayDow: number;
  items: AlertPreviewItem[] | undefined; // undefined = 불러오는 중
  isError: boolean;
  onRetry: () => void;
  todaySchedules: Schedule[];
  hasSchedules: boolean;
  leadMin: number;
}

function cardTitle(todayDow: number, count: number, hasSchedules: boolean) {
  if (count === 0) return `오늘(${dayLabel(todayDow)})은 보낼 알림이 없어요`;
  if (!hasSchedules) return `지금은 하루 ${count}번만 알려드려요`;
  return `오늘(${dayLabel(todayDow)}) 딜 알림 ${count}번`;
}

// 시간표 위 요약: 오늘 받을 딜 알림 시각 (R13)
export function TodayAlertCard({
  todayDow,
  items,
  isError,
  onRetry,
  todaySchedules,
  hasSchedules,
  leadMin,
}: TodayAlertCardProps) {
  const lead = leadLabel(leadMin);

  return (
    <section className="mx-4 mt-3 mb-4 rounded-card bg-surface p-4 ring-1 ring-line">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-bold">
          {items ? cardTitle(todayDow, items.length, hasSchedules) : '오늘 딜 알림'}
        </h2>
        <Link to="/me/schedules/alerts" className="shrink-0 text-xs text-faint">
          알림 시간 보기 ›
        </Link>
      </div>

      {isError ? (
        <button type="button" onClick={onRetry} className="mt-3 text-sm text-muted underline">
          알림 시각을 불러오지 못했어요. 다시 시도
        </button>
      ) : !items ? (
        <div className="mt-3 h-16 animate-pulse rounded-[12px] bg-gray" />
      ) : (
        items.length > 0 && (
          <ul className="mt-3 grid grid-cols-3 gap-2">
            {items.map((item) => (
              <li key={item.slot} className="rounded-[12px] bg-accent-tint px-3 py-2.5">
                <p className="text-lg leading-tight font-bold text-accent">{item.at}</p>
                <p className="mt-0.5 truncate text-xs text-muted">
                  {alertLabel(item, todaySchedules)}
                </p>
              </li>
            ))}
          </ul>
        )
      )}

      <p className="mt-3 text-xs text-muted">
        {hasSchedules
          ? `첫 일정 ${lead} 전 · 점심 · 저녁, 하루 3번까지만 보내요`
          : `일정을 넣으면 첫 외출 ${lead} 전 알림이 더해져요`}
      </p>
    </section>
  );
}
