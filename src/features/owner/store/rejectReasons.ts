// 거절·정지 사유 코드 → 화면 문구 (DB stores.reject_code · suspend_code와 같은 값)
export const REJECT_REASONS = [
  {
    value: 'out_of_area',
    label: '월계1동이 아니에요',
    detail: '정확한 매장 위치와 도로명 주소를 확인 후 다시 신청해 주세요.',
  },
  {
    value: 'missing_info',
    label: '가게 정보가 부족해요',
    detail: '가게 이름·업종·사업자 정보를 다시 확인해 주세요.',
  },
  {
    value: 'duplicate',
    label: '중복 신청이에요',
    detail: '이미 신청한 가게가 있어요. 운영자에게 문의해 주세요.',
  },
  {
    value: 'license_unreadable',
    label: '등록증 사진이 잘 안 보여요',
    detail: '사업자등록증 전체가 선명하게 보이도록 다시 찍어 주세요.',
  },
  { value: 'etc', label: '기타', detail: '운영자 안내를 확인해 주세요.' },
] as const;
export type RejectCode = (typeof REJECT_REASONS)[number]['value'];

export const SUSPEND_REASONS = [
  { value: 'fake_deal_repeat', label: '허위 딜 반복' },
  { value: 'closed', label: '영업 중단' },
  { value: 'owner_request', label: '사장님 요청' },
  { value: 'etc', label: '기타' },
] as const;
export type SuspendCode = (typeof SUSPEND_REASONS)[number]['value'];

export function rejectReasonOf(code: string | null) {
  return REJECT_REASONS.find((reason) => reason.value === code) ?? REJECT_REASONS[4];
}

export function suspendReasonLabel(code: string | null): string {
  return SUSPEND_REASONS.find((reason) => reason.value === code)?.label ?? '기타';
}
