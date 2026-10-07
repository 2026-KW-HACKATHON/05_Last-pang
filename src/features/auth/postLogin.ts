import type { Role } from './api';

/** 로그인 후 첫 화면 (README 6장: 역할·동의 여부에 따라 이동). afterLogin은 공유 링크·가게 등록 */
export function postLoginPath(
  role: Role | null,
  hasAgreedTerms: boolean,
  afterLogin: string | null = null,
): string {
  // 가게 등록은 주민도 들어가는 화면이라 동의 여부와 상관없이 보낸다
  if (afterLogin?.startsWith('/owner/signup')) return afterLogin;
  if (role === 'admin') return afterLogin ?? '/admin/approved-stores';
  if (role === 'owner') return afterLogin ?? '/owner';
  if (!hasAgreedTerms) return '/onboarding/consent';
  return afterLogin ?? '/';
}
