// 동의 시트에 보여줄 약관 본문 (R15 약관 보기 화면과 같은 문구)
export interface TermsArticle {
  heading: string;
  body: string;
}

export interface TermsDoc {
  title: string;
  articles: TermsArticle[];
}

export type TermsKey = 'age' | 'service' | 'privacy' | 'location' | 'push';

export const TERMS_EFFECTIVE_DATE = '시행일 2026년 10월 6일';

export const TERMS: Record<TermsKey, TermsDoc> = {
  age: {
    title: '만 14세 이상 확인',
    articles: [
      {
        heading: '만 14세 이상만 가입할 수 있어요',
        body: '만 14세 미만은 법정대리인의 동의 없이 개인정보를 받을 수 없어 가입할 수 없어요. 사실과 다르면 이용이 제한될 수 있어요.',
      },
    ],
  },
  service: {
    title: '서비스 이용약관',
    articles: [
      {
        heading: '제1조 (목적)',
        body: '이 약관은 동네냠냠이 제공하는 동네 타임딜 서비스의 이용 조건과 절차, 이용자와 서비스의 권리·의무를 정해요.',
      },
      {
        heading: '제2조 (용어의 정의)',
        body: "'타임딜'은 가게 사장님이 한산한 시간에 등록하는 시간 한정 혜택이에요. '쿠폰'은 주민이 타임딜을 받아 매장에서 쓰는 권리예요.",
      },
      {
        heading: '제3조 (쿠폰 발급 및 사용)',
        body: '쿠폰은 딜 하나에 한 번만 받을 수 있고, 받은 뒤 정해진 시간 안에 매장에서 가게 코드를 입력해야 사용돼요. 시간이 지나면 자동으로 반환돼요.',
      },
      {
        heading: '제4조 (금지 행위)',
        body: '허위 딜 등록, 쿠폰 부정 사용, 다른 사람의 계정 사용은 금지돼요. 확인되면 이용이 제한될 수 있어요.',
      },
    ],
  },
  privacy: {
    title: '개인정보 수집·이용',
    articles: [
      { heading: '모으는 정보', body: '닉네임, 카카오 회원 번호' },
      { heading: '위치 정보', body: '자주 있는 곳 (약 100m 단위)' },
      { heading: '쓰는 곳', body: '딜 추천, 알림 발송' },
      { heading: '보관 기간', body: '탈퇴하면 바로 삭제' },
      {
        heading: '제3자 제공',
        body: '이용자의 동의 없이 개인정보를 다른 곳에 주지 않아요. 사장님에게는 닉네임과 연락처를 보여주지 않아요.',
      },
      {
        heading: '문의',
        body: '개인정보 관련 문의는 내 정보 › 문의하기로 보내 주세요.',
      },
    ],
  },
  location: {
    title: '위치기반서비스 이용약관',
    articles: [
      {
        heading: '제1조 (목적)',
        body: '이 약관은 동네냠냠이 제공하는 위치기반서비스의 이용 조건과 절차를 정해요.',
      },
      {
        heading: '제2조 (서비스 내용)',
        body: '이용자의 현재 위치와 가게 사이의 거리를 계산해 가까운 딜을 보여주고, 걸어갈 수 있는 거리 안의 딜을 알림으로 알려드려요.',
      },
      {
        heading: '제3조 (위치정보의 보관)',
        body: "현재 위치는 계산에만 쓰고 저장하지 않아요. 직접 설정한 '자주 있는 곳'만 약 100m 단위로 흐리게 저장하고, 탈퇴하면 바로 지워요.",
      },
      {
        heading: '제4조 (동의 철회)',
        body: '위치 사용은 선택이에요. 내 정보 › 좋아하는 가게·거리 또는 알림함 › 알림 설정에서 언제든 끌 수 있어요.',
      },
    ],
  },
  push: {
    title: '실시간 딜 알림 받기',
    articles: [
      {
        heading: '어떤 알림을 보내나요',
        body: '좋아하는 가게의 마감 타임딜이 걸어갈 수 있는 거리 안에서 열리면 알려드려요.',
      },
      {
        heading: '얼마나 자주 보내나요',
        body: '하루 최대 3번, 같은 가게는 하루 1번만 보내요. 밤 10시~아침 8시에는 보내지 않아요.',
      },
      {
        heading: '동의 철회',
        body: '선택 항목이에요. 내 정보 › 알림 받기에서 언제든 끌 수 있어요.',
      },
    ],
  },
};
