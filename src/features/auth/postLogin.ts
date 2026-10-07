import type { Role } from './api';

/** 로그인 후 첫 화면 (README 6장: 역할·동의 여부에 따라 이동) */
export function postLoginPath(role: Role | null, hasAgreedTerms: boolean): string {
  if (role === 'admin') return '/admin/approved-stores';
  if (role === 'owner') return '/owner';
  return hasAgreedTerms ? '/' : '/onboarding/consent';
}
