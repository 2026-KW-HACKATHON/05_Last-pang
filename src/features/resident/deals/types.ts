import type { Category } from '@/shared/constants/domain';

/** 홈 목록 한 줄 (recommend_deals 결과) */
export interface DealSummary {
  dealId: string;
  storeId: string;
  storeName: string;
  category: Category;
  title: string;
  originalPrice: number;
  dealPrice: number;
  remainingQty: number;
  totalQty: number;
  startsAt: string;
  endsAt: string;
  couponTtlMin: number;
  distanceM: number;
}

export type DealStatus = 'active' | 'paused' | 'closed';

export interface DealDetail {
  id: string;
  storeId: string;
  storeName: string;
  category: Category;
  address: string;
  storeLat: number;
  storeLng: number;
  title: string;
  originalPrice: number;
  dealPrice: number;
  startsAt: string;
  endsAt: string;
  totalQty: number;
  remainingQty: number;
  couponTtlMin: number;
  status: DealStatus;
}

/** 이 딜에서 내가 받은 쿠폰 (유효·사용만. 만료 쿠폰은 다시 받을 수 있어 무시한다) */
export interface MyDealCoupon {
  id: string;
  status: 'issued' | 'used';
  expiresAt: string;
}

export interface ClaimResult {
  couponId: string;
  expiresAt: string;
}

/** 실시간으로 바뀌는 값만 (Realtime UPDATE) */
export interface DealLiveFields {
  remainingQty: number;
  status: DealStatus;
}

/** 오늘 쿠폰 사용 횟수 (get_my_daily_usage) */
export interface DailyUsage {
  usedToday: number;
  limit: number;
}

export type DealSort = 'distance' | 'ending' | 'discount';
