// 사장님·운영자 화면 날짜 표기 (기기 시간대와 상관없이 한국 시각)
import { DAYS } from '@/shared/constants/domain';

const KST = 'Asia/Seoul';

const partsOf = (date: Date) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: KST,
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';
  return { month: pick('month'), day: pick('day'), hour: pick('hour'), minute: pick('minute') };
};

/** "14:23" */
export function formatClock(iso: string): string {
  const { hour, minute } = partsOf(new Date(iso));
  return `${hour}:${minute}`;
}

/** "10월 5일 14:02" */
export function formatMonthDayTime(iso: string): string {
  const { month, day, hour, minute } = partsOf(new Date(iso));
  return `${month}월 ${day}일 ${hour}:${minute}`;
}

/** "YYYY-MM-DD"(한국 날짜) → "9월 29일" */
export function formatMonthDay(kstDate: string): string {
  const [, month, day] = kstDate.split('-');
  return `${Number(month)}월 ${Number(day)}일`;
}

/** 남은 시간 "1시간 12분 남음" / "12분 남음" / "곧 끝나요" */
export function formatTimeLeft(endsAtIso: string, now: number): string {
  const minutes = Math.floor((new Date(endsAtIso).getTime() - now) / 60_000);
  if (minutes < 1) return '곧 끝나요';
  const hours = Math.floor(minutes / 60);
  return hours > 0 ? `${hours}시간 ${minutes % 60}분 남음` : `${minutes}분 남음`;
}

/** 시(0~23) → "오후 3시" */
export function formatHourKo(hour: number): string {
  if (hour === 0) return '밤 12시';
  if (hour < 12) return `오전 ${hour}시`;
  if (hour === 12) return '낮 12시';
  return `오후 ${hour - 12}시`;
}

/** 화면은 월요일부터, DB 값은 0=일 */
export const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0] as const;

/** [1,2,3,4,5] → "월·화·수·목·금" */
export function formatRepeatDays(days: number[]): string {
  return WEEK_ORDER.filter((day) => days.includes(day))
    .map((day) => DAYS[day])
    .join('·');
}
