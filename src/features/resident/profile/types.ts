export interface MyProfile {
  nickname: string | null;
  agreedTermsAt: string | null; // null이면 아직 온보딩 전
  agreedLocationAt: string | null;
  agreedPushAt: string | null;
}

export interface ConsentInput {
  hasLocationConsent: boolean;
  hasPushConsent: boolean;
}
