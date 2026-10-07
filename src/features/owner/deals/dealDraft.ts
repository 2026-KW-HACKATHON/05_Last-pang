import type { COUPON_TTL_OPTIONS } from '@/shared/constants/domain';

import type { DealFormInput } from './schema';

// 즉시딜 입력 중인 값 (O4 · 운영자 대신 올리기 공통)
export type DealDraft = Omit<DealFormInput, 'couponTtlMin' | 'durationMin'> & {
  durationMin: 60 | 120 | 180;
  couponTtlMin: (typeof COUPON_TTL_OPTIONS)[number];
};

export const EMPTY_DEAL_DRAFT: DealDraft = {
  title: '',
  originalPrice: 0,
  dealPrice: 0,
  totalQty: 10,
  durationMin: 120,
  couponTtlMin: 15,
};
