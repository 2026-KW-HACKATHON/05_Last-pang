import { describe, expect, it } from 'vitest';

import { postLoginPath } from './postLogin';

describe('postLoginPath', () => {
  it('운영자는 가맹점 목록, 사장님은 사장님 홈', () => {
    expect(postLoginPath('admin', false)).toBe('/admin/approved-stores');
    expect(postLoginPath('owner', false)).toBe('/owner');
  });
  it('주민은 동의 전이면 동의 화면, 동의 후면 홈', () => {
    expect(postLoginPath('resident', false)).toBe('/onboarding/consent');
    expect(postLoginPath('resident', true)).toBe('/');
    expect(postLoginPath(null, true)).toBe('/');
  });
  it('공유받은 딜은 동의를 마친 주민만 바로 연다', () => {
    expect(postLoginPath('resident', true, '/deals/abc')).toBe('/deals/abc');
    expect(postLoginPath('resident', false, '/deals/abc')).toBe('/onboarding/consent');
  });
  it('가게 등록하기는 동의 전이어도 등록 화면으로', () => {
    expect(postLoginPath('resident', false, '/owner/signup')).toBe('/owner/signup');
  });
});
