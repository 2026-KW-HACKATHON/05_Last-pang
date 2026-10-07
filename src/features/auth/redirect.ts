// 로그인 후 돌아갈 주소 (C3 공유받은 딜 링크, R1 "가게 등록하기").
// 카카오 로그인은 페이지를 떠났다 돌아오므로 sessionStorage에 잠깐 둔다. 저장소를 못 쓰면 홈으로 간다
const KEY = 'dnnn.afterLogin';

/** 앱 안의 경로만 받는다 (다른 사이트로 보내는 열린 리다이렉트 방지) */
export function isSafePath(path: string | null): path is string {
  return Boolean(path && path.startsWith('/') && !path.startsWith('//') && path !== '/login');
}

export function saveAfterLogin(path: string | null) {
  if (!isSafePath(path)) return;
  try {
    sessionStorage.setItem(KEY, path);
  } catch {
    // 저장소를 못 쓰는 브라우저: 로그인 후 기본 첫 화면으로 간다
  }
}

export function takeAfterLogin(): string | null {
  try {
    const path = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    return isSafePath(path) ? path : null;
  } catch {
    return null;
  }
}
