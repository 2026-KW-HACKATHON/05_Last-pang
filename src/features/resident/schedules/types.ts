export type ScheduleKind = 'class' | 'work' | 'parttime' | 'exercise' | 'academy' | 'etc';
export type ScheduleColor = 'crimson' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'gray';

/** 반복 일정 블록. 요일은 DB와 같이 0=일 … 6=토, 시각은 자정부터 분 */
export interface Schedule {
  id: string;
  name: string;
  days: number[];
  startMin: number;
  endMin: number;
  kind: ScheduleKind | null;
  color: ScheduleColor;
}

/** 추가·고치기 시트에서 다루는 값 */
export type ScheduleDraft = Omit<Schedule, 'id'>;

/** get_my_free_times 한 줄: 그날 30분 이상 비는 시간 (방해 금지 시간 제외) */
export interface FreeTimeItem {
  day: string; // YYYY-MM-DD
  from: string; // HH:MM
  to: string; // HH:MM ('00:00'이면 자정)
}

/** 시간표 위에 칠하는 비는 시간 (자정부터 분) */
export interface FreeRange {
  dow: number;
  startMin: number;
  endMin: number;
}

/** 그리드에서 끌어 고른 범위 */
export interface DragRange {
  dow: number;
  startMin: number;
  endMin: number;
}
