// DB check 제약과 반드시 같은 값 (2-1 create_core_tables). 팀 결정 전 임시값이라
// 바꿀 때는 마이그레이션(stores.category, coupon_ttl_min, radius_m)과 같은 날 함께 고친다 (컨벤션 14장)

export const CATEGORIES = [
  { value: 'meal', label: '식사' },
  { value: 'cafe', label: '카페' },
  { value: 'bakery', label: '베이커리' },
  { value: 'snack', label: '분식' },
  { value: 'etc', label: '기타' },
] as const;
export type Category = (typeof CATEGORIES)[number]['value'];

export const TIME_SLOTS = [
  { value: 'morning', label: '아침 7–11시' },
  { value: 'lunch', label: '점심 11–14시' },
  { value: 'afternoon', label: '오후 14–17시' },
  { value: 'evening', label: '저녁 17–21시' },
] as const;
export type TimeSlot = (typeof TIME_SLOTS)[number]['value'];

/** index = DB의 요일 값 (0 = 일 ~ 6 = 토, Postgres extract(dow)와 같음) */
export const DAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

export const COUPON_TTL_OPTIONS = [10, 15, 20, 30] as const;

export const DEFAULT_RADIUS_M = 800;
export const MIN_RADIUS_M = 200;
export const MAX_RADIUS_M = 2000;
