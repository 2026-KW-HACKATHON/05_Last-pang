// 로그인 후 돌아갈 주소 (C3 공유받은 딜 링크, R1 "가게 등록하기").
// 카카오 로그인은 페이지를 떠났다 돌아오고, 휴대폰에서는 카카오톡 앱을 거쳐 새 탭으로 돌아올 수 있어
// sessionStorage(탭마다 따로)가 아닌 localStorage에 10분만 둔다. 저장소를 못 쓰면 기본 첫 화면으로 간다
const KEY = 'dnnn.afterLogin';
const TTL_MS = 10 * 60 * 1000;

/** 앱 안의 경로만 받는다 (다른 사이트로 보내는 열린 리다이렉트 방지) */
export function isSafePath(path: string | null): path is string {
  return Boolean(path && path.startsWith('/') && !path.startsWith('//') && path !== '/login');
}

export function saveAfterLogin(path: string | null) {
  if (!isSafePath(path)) return;
  try {
    localStorage.setItem(KEY, JSON.stringify({ path, savedAt: Date.now() }));
  } catch {
    // 저장소를 못 쓰는 브라우저: 로그인 후 기본 첫 화면으로 간다
  }
}

export function takeAfterLogin(): string | null {
  try {
    const raw = localStorage.getItem(KEY);
    localStorage.removeItem(KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as { path?: unknown; savedAt?: unknown };
    const path = typeof saved.path === 'string' ? saved.path : null;
    const isFresh = typeof saved.savedAt === 'number' && Date.now() - saved.savedAt < TTL_MS;
    return isFresh && isSafePath(path) ? path : null;
  } catch {
    return null;
  }
}
