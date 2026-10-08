import type { IconName } from '@/shared/ui/Icon';

import type { Platform } from './platform';

export interface GuideStep {
  icon: IconName;
  title: string;
  hint: string;
}

// R16 홈 화면에 추가하는 법. 큰 글씨 한 줄 + 작은 설명 한 줄만
export const GUIDE_STEPS: Record<Platform, GuideStep[]> = {
  ios: [
    {
      icon: 'compass',
      title: 'Safari로 열어요',
      hint: '카카오톡·인스타 안이라면 ⋯ → Safari로 열기',
    },
    { icon: 'share', title: '공유 버튼을 눌러요', hint: '네모에 ↑ 모양. 안 보이면 ⋯ → 공유' },
    { icon: 'plusSquare', title: "'홈 화면에 추가'를 골라요", hint: '목록을 아래로 내리면 있어요' },
    { icon: 'check', title: "'추가'를 눌러요", hint: "'웹 앱으로 열기'는 켜 둔 채로" },
    {
      icon: 'home',
      title: '홈 화면 아이콘으로 열어요',
      hint: '카카오 로그인 한 번 더 → 알림 켜기',
    },
  ],
  android: [
    {
      icon: 'compass',
      title: 'Chrome으로 열어요',
      hint: '카카오톡 안이라면 ⋮ → 다른 브라우저로 열기',
    },
    { icon: 'more', title: '오른쪽 위 ⋮를 눌러요', hint: '주소창 오른쪽 끝 점 세 개' },
    { icon: 'download', title: "'앱 설치'를 골라요", hint: "없으면 '홈 화면에 추가'" },
    { icon: 'check', title: "'설치'를 눌러요", hint: "'바로가기 만들기' 말고 '설치'" },
    { icon: 'home', title: '홈 화면 아이콘으로 열어요', hint: '카카오 로그인 → 알림 켜기' },
  ],
};

export const GUIDE_TROUBLES: Record<Platform, { q: string; a: string }[]> = {
  ios: [
    {
      q: "'홈 화면에 추가'가 없어요",
      a: '앱 안 브라우저나 개인정보 보호 모드(검은 주소창)예요. Safari 일반 탭으로 열어 주세요.',
    },
    {
      q: '알림이 안 와요',
      a: '홈 화면 아이콘으로 열었는지, 설정 → 알림 → 동네냠냠이 켜져 있는지 확인해요.',
    },
    { q: 'iOS 버전이 낮대요', a: 'iOS 16.4 이상이 필요해요. 설정 → 일반 → 정보에서 확인해요.' },
  ],
  android: [
    {
      q: '삼성 인터넷을 써요',
      a: '≡ → 현재 페이지 추가 → 홈 화면. 알림이 안 오면 Chrome을 써 주세요.',
    },
    {
      q: "'앱 설치'가 안 보여요",
      a: '이미 설치됐을 수 있어요. 앱 목록에서 동네냠냠을 찾아보세요.',
    },
    { q: '알림이 안 와요', a: '설정 → 애플리케이션 → 동네냠냠(또는 Chrome) → 알림을 허용해요.' },
  ],
};
