/** iPhone Safari는 홈 화면에 추가한 앱에서만 웹 푸시를 받을 수 있어, 브라우저 탭이면 추가 방법을 안내한다 */
export const shouldShowIosInstallGuide = () =>
  /iPhone|iPad|iPod/.test(navigator.userAgent) &&
  !window.matchMedia('(display-mode: standalone)').matches;
