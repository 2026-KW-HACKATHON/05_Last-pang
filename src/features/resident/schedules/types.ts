export type ScheduleKind = 'class' | 'work' | 'parttime' | 'exercise' | 'academy' | 'etc';
export type ScheduleColor = 'crimson' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'gray';
export type AlertSlot = 'morning' | 'lunch' | 'dinner';
export type LeadMin = 15 | 30 | 60;

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

/** get_my_alert_preview 한 줄 */
export interface AlertPreviewItem {
  day: string; // YYYY-MM-DD
  slot: AlertSlot;
  at: string; // HH:MM
  label: string;
}

export interface AlertSettings {
  morning: boolean;
  lunch: boolean;
  dinner: boolean;
  leadMin: LeadMin;
}

/** 그리드에서 끌어 고른 범위 */
export interface DragRange {
  dow: number;
  startMin: number;
  endMin: number;
}
