export type Platform = 'ios' | 'android';

export const detectPlatform = (): Platform =>
  /iPhone|iPad|iPod/.test(navigator.userAgent) ? 'ios' : 'android';

/** 홈 화면 앱으로 열렸는지 (iOS Safari는 navigator.standalone) */
export const isStandalone = (): boolean =>
  window.matchMedia('(display-mode: standalone)').matches ||
  ('standalone' in navigator && navigator.standalone === true);

const IN_APP: [RegExp, string][] = [
  [/KAKAOTALK/i, '카카오톡'],
  [/everytime/i, '에브리타임'],
  [/NAVER/i, '네이버 앱'],
  [/Instagram/i, '인스타그램'],
  [/FBAN|FBAV/i, '페이스북'],
  [/\bLine\//i, '라인'],
  [/DaumApps/i, '다음 앱'],
];

/** 카카오톡 등 앱 안의 브라우저면 그 앱 이름 (여기서는 홈 화면 추가·알림이 안 된다) */
export const detectInAppBrowser = (): string | null =>
  IN_APP.find(([pattern]) => pattern.test(navigator.userAgent))?.[1] ?? null;

export const isSamsungBrowser = (): boolean => /SamsungBrowser/i.test(navigator.userAgent);
