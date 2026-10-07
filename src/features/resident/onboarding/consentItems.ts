import type { ConsentForm } from './schema';
import type { TermsKey } from './termsText';

export interface ConsentItem {
  name: keyof ConsentForm;
  termsKey: TermsKey;
  label: string;
  description?: string;
  isRequired: boolean;
}

// 동의 항목 (피그마 R2). 순서대로 화면에 그린다
export const CONSENT_ITEMS: ConsentItem[] = [
  { name: 'isOver14', termsKey: 'age', label: '만 14세 이상이에요', isRequired: true },
  { name: 'hasTermsConsent', termsKey: 'service', label: '서비스 이용약관', isRequired: true },
  {
    name: 'hasPrivacyConsent',
    termsKey: 'privacy',
    label: '개인정보 수집·이용',
    description: '(닉네임, 카카오 회원 번호)',
    isRequired: true,
  },
  {
    name: 'hasLocationConsent',
    termsKey: 'location',
    label: '위치 기반 서비스 이용',
    description: '현재 위치는 거리 계산에만 쓰고 저장하지 않아요',
    isRequired: false,
  },
  { name: 'hasPushConsent', termsKey: 'push', label: '실시간 딜 알림 받기', isRequired: false },
];
