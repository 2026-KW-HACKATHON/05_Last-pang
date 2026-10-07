// 문의하기·자주 묻는 질문 (공통 C8 · C8-1). 이메일 주소는 피그마 예시 값이라 실제 받는 주소로 바꾼 뒤 배포한다
import { POLICY } from './policy';

export const SUPPORT_EMAIL = 'help@dongne-nyam.kr';
export const SUPPORT_HOURS = '평일 10:00~18:00';

export const FAQ_CATEGORIES = ['전체', '쿠폰', '가게 코드', '알림', '위치·계정', '사장님'] as const;
export type FaqCategory = (typeof FAQ_CATEGORIES)[number];

export interface FaqItem {
  id: string;
  category: Exclude<FaqCategory, '전체'>;
  question: string;
  answer: string;
  link?: { label: string; to: string };
}

// 답은 지금 서버 규칙(마이그레이션)과 맞춘다. 수량은 쿠폰을 "받을 때" 줄어든다 (10/7 결정, 피그마 문구와 다름)
export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'coupon-expire',
    category: '쿠폰',
    question: '쿠폰 시간이 지나면 어떻게 되나요?',
    answer:
      '받은 뒤 정해진 시간(보통 15분) 안에 쓰지 않으면 쿠폰은 자동으로 반환돼요. 딜이 아직 진행 중이고 수량이 남아 있으면 다시 받을 수 있어요.',
    link: { label: '내 쿠폰 보기', to: '/coupons' },
  },
  {
    id: 'coupon-soldout',
    category: '쿠폰',
    question: '쿠폰을 받았는데 수량이 다 떨어졌대요',
    answer:
      '수량은 쿠폰을 받는 순간 줄어요. 이미 받은 쿠폰은 유효시간 안에 매장에서 그대로 쓸 수 있어요. 시간이 지나 반환된 쿠폰은 다시 수량으로 돌아가요.',
  },
  {
    id: 'coupon-daily',
    category: '쿠폰',
    question: '쿠폰은 하루에 몇 번 쓸 수 있나요?',
    answer: `한 사람이 하루에 ${POLICY.residentDailyRedeem}번까지 쓸 수 있어요. 같은 딜은 한 번만 받을 수 있어요.`,
  },
  {
    id: 'code-where',
    category: '가게 코드',
    question: '가게 코드는 어디서 알 수 있나요?',
    answer: '가게 코드는 사장님께 물어봐 주세요. 카운터에 적혀 있거나 사장님이 직접 알려 주세요.',
  },
  {
    id: 'code-locked',
    category: '가게 코드',
    question: '코드를 5번 틀려서 입력이 막혔어요',
    answer:
      '10분 안에 5번 틀리면 잠시 막혀요. 화면의 시간이 지나면 다시 입력할 수 있어요. 쿠폰 유효시간이 지나면 쿠폰은 반환돼요.',
  },
  {
    id: 'push-none',
    category: '알림',
    question: '알림이 오지 않아요',
    answer:
      '알림 설정이 켜져 있는지, 방해 금지 시간이 아닌지 확인해 주세요. iPhone은 홈 화면에 추가한 앱에서만 알림이 와요.',
    link: { label: '알림 설정으로 가기', to: '/notifications?tab=settings' },
  },
  {
    id: 'push-many',
    category: '알림',
    question: '알림이 너무 자주 와요',
    answer: `한 사람에게 하루 ${POLICY.residentDailyPush}번, 같은 가게는 하루 ${POLICY.sameStoreDailyPush}번까지만 보내요. 내 시간표의 알림 시간에서 아침·점심·저녁 알림을 하나씩 끌 수 있어요.`,
    link: { label: '알림 시간 보기', to: '/me/schedules' },
  },
  {
    id: 'location-saved',
    category: '위치·계정',
    question: '내 위치가 저장되나요?',
    answer:
      '현재 위치는 거리 계산에만 쓰고 저장하지 않아요. 기준 위치는 약 100m 단위로 흐려서 저장해요.',
  },
  {
    id: 'location-other',
    category: '위치·계정',
    question: '월계1동 주민이 아니어도 쓸 수 있나요?',
    answer:
      '월계1동에 살거나 학교·직장에 다니면 쓸 수 있어요. 다른 동네는 순서대로 열릴 예정이에요.',
  },
  {
    id: 'owner-fee',
    category: '사장님',
    question: '수수료가 있나요?',
    answer: '지금은 수수료가 없어요. 딜을 올리고 손님이 쿠폰을 쓰는 데 드는 비용은 없어요.',
  },
  {
    id: 'owner-daily',
    category: '사장님',
    question: '딜은 하루에 몇 개 올릴 수 있나요?',
    answer: `즉시딜은 하루 ${POLICY.ownerDailyDeals}개까지, 같은 시간대에는 하나만 올릴 수 있어요. 요일 반복딜이 자동으로 만든 딜은 세지 않아요.`,
  },
  {
    id: 'owner-code',
    category: '사장님',
    question: '가게 코드를 잊어버렸어요',
    answer: '가게 코드 탭에서 새로 발급할 수 있어요. 새로 발급하면 이전 코드는 바로 쓸 수 없어요.',
    link: { label: '가게 코드로 가기', to: '/owner/settings' },
  },
  {
    id: 'owner-review',
    category: '사장님',
    question: '입점 심사는 얼마나 걸리나요?',
    answer: '보통 하루 안에 끝나요. 결과는 사장님 홈과 알림으로 알려 드려요.',
  },
];
