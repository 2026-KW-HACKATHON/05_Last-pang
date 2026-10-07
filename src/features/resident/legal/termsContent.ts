// 약관 본문 (피그마 R15). 문구를 바꿀 때는 R2 약관 상세와 함께 맞춘다
export type TermsKind = 'service' | 'privacy' | 'location';

export interface TermsSection {
  heading: string;
  lines: string[];
}

export interface TermsDocument {
  title: string;
  effectiveDate: string;
  summary?: { label: string; value: string }[];
  note?: string;
  sections: TermsSection[];
}

export const TERMS_EFFECTIVE_DATE = '2026년 10월 6일';

export const TERMS_CONTENT: Record<TermsKind, TermsDocument> = {
  service: {
    title: '이용약관',
    effectiveDate: TERMS_EFFECTIVE_DATE,
    sections: [
      {
        heading: '제1조 (목적)',
        lines: [
          '이 약관은 동네냠냠이 제공하는 동네 타임딜 서비스의 이용 조건과 절차, 이용자와 서비스의 권리·의무를 정해요.',
        ],
      },
      {
        heading: '제2조 (용어의 정의)',
        lines: [
          "'타임딜'은 가게 사장님이 한산한 시간에 등록하는 시간 한정 혜택이에요. '쿠폰'은 주민이 타임딜을 받아 매장에서 쓰는 권리예요.",
        ],
      },
      {
        heading: '제3조 (쿠폰 발급 및 사용)',
        lines: [
          '쿠폰은 딜 하나에 한 번만 받을 수 있고, 받은 뒤 정해진 시간 안에 매장에서 가게 코드를 입력해야 사용돼요. 시간이 지나면 자동으로 반환돼요.',
        ],
      },
      {
        heading: '제4조 (금지 행위)',
        lines: [
          '허위 딜 등록, 쿠폰 부정 사용, 다른 사람의 계정 사용은 금지돼요. 확인되면 이용이 제한될 수 있어요.',
        ],
      },
    ],
  },
  privacy: {
    title: '개인정보 처리방침',
    effectiveDate: TERMS_EFFECTIVE_DATE,
    summary: [
      { label: '모으는 정보', value: '닉네임, 카카오 회원 번호' },
      { label: '위치 정보', value: '자주 있는 곳 (약 100m 단위)' },
      { label: '쓰는 곳', value: '딜 추천, 알림 발송' },
      { label: '보관 기간', value: '탈퇴하면 바로 삭제' },
    ],
    note: '지금 있는 위치(실시간 위치)는 거리 계산에만 쓰고 어디에도 저장하지 않아요.',
    sections: [
      {
        heading: '제3자 제공',
        lines: [
          '이용자의 동의 없이 개인정보를 다른 곳에 주지 않아요.',
          '사장님에게는 닉네임과 연락처를 보여주지 않아요.',
        ],
      },
      {
        heading: '문의',
        lines: ['개인정보 관련 문의는 내 정보 › 문의하기로 보내 주세요.'],
      },
    ],
  },
  location: {
    title: '위치기반서비스 이용약관',
    effectiveDate: TERMS_EFFECTIVE_DATE,
    sections: [
      {
        heading: '제1조 (목적)',
        lines: ['이 약관은 동네냠냠이 제공하는 위치기반서비스의 이용 조건과 절차를 정해요.'],
      },
      {
        heading: '제2조 (서비스 내용)',
        lines: [
          '이용자의 현재 위치와 가게 사이의 거리를 계산해 가까운 딜을 보여주고, 걸어갈 수 있는 거리 안의 딜을 알림으로 알려드려요.',
        ],
      },
      {
        heading: '제3조 (위치정보의 보관)',
        lines: [
          "현재 위치는 계산에만 쓰고 저장하지 않아요. 직접 설정한 '자주 있는 곳'만 약 100m 단위로 흐리게 저장하고, 탈퇴하면 바로 지워요.",
        ],
      },
      {
        heading: '제4조 (동의 철회)',
        lines: [
          '위치 사용은 선택이에요. 내 정보 › 좋아하는 가게·거리 또는 알림함 › 알림 설정에서 언제든 끌 수 있어요.',
        ],
      },
    ],
  },
};

export const isTermsKind = (value: string | undefined): value is TermsKind =>
  value === 'service' || value === 'privacy' || value === 'location';
