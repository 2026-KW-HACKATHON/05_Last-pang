import type { COUPON_TTL_OPTIONS } from '@/shared/constants/domain';

import type { WeeklyDealInput } from './schema';

// 요일 반복딜 입력 중인 값 (O5 · O5-1 공통)
export type WeeklyDraft = Omit<WeeklyDealInput, 'couponTtlMin'> & {
  couponTtlMin: (typeof COUPON_TTL_OPTIONS)[number];
};

export const EMPTY_WEEKLY_DRAFT: WeeklyDraft = {
  title: '',
  originalPrice: 0,
  dealPrice: 0,
  repeatDays: [1, 2, 3, 4, 5],
  startTime: '15:00',
  endTime: '17:00',
  qty: 5,
  couponTtlMin: 15,
};
