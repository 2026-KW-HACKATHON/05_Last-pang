import { Link } from 'react-router-dom';

import { POLICY } from '@/shared/constants/policy';

import { dayLabel, formatFreeTime } from '../time';

import type { FreeTimeItem } from '../types';

interface TodayFreeTimeCardProps {
  todayDow: number;
  items: FreeTimeItem[] | undefined; // undefined = 불러오는 중
  isError: boolean;
  onRetry: () => void;
  hasSchedules: boolean;
}

// 시간표 위 요약: 오늘 딜 알림을 받는 비는 시간 (딜 시간과 30분 이상 겹치면 열리자마자 알림)
export function TodayFreeTimeCard({
  todayDow,
  items,
  isError,
  onRetry,
  hasSchedules,
}: TodayFreeTimeCardProps) {
  const title = !items
    ? '오늘 비는 시간'
    : items.length === 0
      ? `오늘(${dayLabel(todayDow)})은 비는 시간이 없어요`
      : `오늘(${dayLabel(todayDow)}) 비는 시간 ${items.length}곳`;

  return (
    <section className="mx-4 mt-3 mb-4 rounded-card bg-surface p-4 ring-1 ring-line">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-bold">{title}</h2>
        <Link to="/me/schedules/alerts" className="shrink-0 text-xs text-faint">
          이번 주 보기 ›
        </Link>
      </div>

      {isError ? (
        <button type="button" onClick={onRetry} className="mt-3 text-sm text-muted underline">
          비는 시간을 불러오지 못했어요. 다시 시도
        </button>
      ) : !items ? (
        <div className="mt-3 h-12 animate-pulse rounded-[12px] bg-gray" />
      ) : (
        items.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {items.map((item) => (
              <li
                key={item.from}
                className="rounded-[12px] bg-success-tint px-3 py-2 text-[15px] font-bold text-success tabular-nums"
              >
                {formatFreeTime(item)}
              </li>
            ))}
          </ul>
        )
      )}

      <p className="mt-3 text-xs leading-relaxed text-muted">
        {hasSchedules
          ? `딜 시간과 비는 시간이 30분 이상 겹치면 딜이 열리자마자 알려드려요 · 하루 ${POLICY.residentDailyPush}번까지`
          : '일정을 넣으면 그 사이 비는 시간에 맞는 딜만 골라 알려드려요'}
      </p>
    </section>
  );
}
