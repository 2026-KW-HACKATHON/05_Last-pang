// O0 사장님 약관 항목 (필수 3 + 선택 1)
export const OWNER_TERMS = [
  { key: 'service', isRequired: true, label: '서비스 이용약관', to: '/terms/service' },
  {
    key: 'privacy',
    isRequired: true,
    label: '개인정보 수집·이용 (대표자 이름, 사업자 정보)',
    to: '/terms/privacy',
  },
  {
    key: 'policy',
    isRequired: true,
    label: '입점 운영 정책 (허위 딜 3회 시 이용 정지)',
    to: '/terms/owner-policy',
  },
  { key: 'marketing', isRequired: false, label: '사장님 소식 받기', to: undefined },
] as const;
export type OwnerTermKey = (typeof OWNER_TERMS)[number]['key'];
