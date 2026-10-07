// 서비스 정책 수치. DB의 app_policy()(마이그레이션 20261007100000)와 반드시 같은 값.
// 운영 설정 화면(A4)과 각 화면 안내 문구가 이 값을 읽는다. 바꿀 때는 마이그레이션과 같은 PR에서 고친다
export const POLICY = {
  neighborhoodName: '월계1동',
  storeRadiusM: 1500,
  residentDailyPush: 3,
  sameStoreDailyPush: 1,
  quietStart: '22:00',
  quietEnd: '08:00',
  residentDailyRedeem: 3,
  ownerDailyDeals: 3,
  reportAutoPause: 3,
  confirmedReportsSuspend: 3,
} as const;

/** 신고 사유 (DB deal_reports.reason) */
export const REPORT_REASONS = [
  { value: 'benefit_mismatch', label: '실제 혜택과 달라요' },
  { value: 'store_closed', label: '가게가 문을 닫았어요' },
  { value: 'coupon_refused', label: '쿠폰을 받아주지 않았어요' },
  { value: 'inappropriate', label: '부적절한 내용이 있어요' },
  { value: 'etc', label: '기타' },
] as const;
export type ReportReason = (typeof REPORT_REASONS)[number]['value'];

export function reportReasonLabel(value: string): string {
  return REPORT_REASONS.find((reason) => reason.value === value)?.label ?? '기타';
}
