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
});
