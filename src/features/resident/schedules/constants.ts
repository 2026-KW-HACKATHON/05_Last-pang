import type { ScheduleColor, ScheduleKind } from './types';

// 시간표 그리드 범위: 8시~22시, 30분 칸
export const GRID_START_MIN = 8 * 60;
export const GRID_END_MIN = 22 * 60;
export const HOUR_PX = 40;
export const SLOT_MIN = 30;
export const SLOT_PX = HOUR_PX / 2;
export const SLOT_COUNT = (GRID_END_MIN - GRID_START_MIN) / SLOT_MIN;

// 화면 순서 월~일 (DB 요일 값 0=일)
export const WEEK_DAYS = [
  { dow: 1, label: '월' },
  { dow: 2, label: '화' },
  { dow: 3, label: '수' },
  { dow: 4, label: '목' },
  { dow: 5, label: '금' },
  { dow: 6, label: '토' },
  { dow: 0, label: '일' },
] as const;

export const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;

// 빠른 선택 칩. 고르면 이름과 기본 색이 같이 정해진다
export const KIND_CHIPS: { kind: ScheduleKind; label: string; color: ScheduleColor }[] = [
  { kind: 'class', label: '수업', color: 'crimson' },
  { kind: 'work', label: '출근', color: 'blue' },
  { kind: 'parttime', label: '알바', color: 'blue' },
  { kind: 'exercise', label: '운동', color: 'green' },
  { kind: 'academy', label: '학원', color: 'yellow' },
];
export const DEFAULT_COLOR: ScheduleColor = 'purple';

// 블록 배경·글자색 (DB color 값과 1:1)
export const COLOR_STYLES: Record<ScheduleColor, { block: string; text: string }> = {
  crimson: { block: 'bg-[#f7d9e1]', text: 'text-[#9c0633]' },
  orange: { block: 'bg-[#fde3cc]', text: 'text-[#9a4a00]' },
  yellow: { block: 'bg-[#f8ebc4]', text: 'text-[#7a5d00]' },
  green: { block: 'bg-[#e0ecd6]', text: 'text-[#3d6a1f]' },
  blue: { block: 'bg-[#d9e7f3]', text: 'text-[#1f4f7a]' },
  purple: { block: 'bg-[#e8def2]', text: 'text-[#5b3a80]' },
  gray: { block: 'bg-[#e6e7ea]', text: 'text-[#4a4f57]' },
};

export const COLOR_ORDER: ScheduleColor[] = [
  'crimson',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'gray',
];

export const MAX_NAME_LENGTH = 20; // DB check (1~20자)
export const LONG_PRESS_MS = 300; // 터치는 꾹 눌러야 끌기 시작 (스크롤과 구분)
export const MOVE_CANCEL_PX = 8; // 꾹 누르기 전에 이만큼 움직이면 스크롤로 본다
