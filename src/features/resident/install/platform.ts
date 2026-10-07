export type Platform = 'ios' | 'android';

export const detectPlatform = (): Platform =>
  /iPhone|iPad|iPod/.test(navigator.userAgent) ? 'ios' : 'android';

/** 홈 화면 앱으로 열렸는지 (iOS Safari는 navigator.standalone) */
export const isStandalone = (): boolean =>
  window.matchMedia('(display-mode: standalone)').matches ||
  ('standalone' in navigator && navigator.standalone === true);
