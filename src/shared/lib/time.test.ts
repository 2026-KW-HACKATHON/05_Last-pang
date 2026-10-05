import { describe, expect, it } from 'vitest';

import { formatRemaining, toKstDateString } from './time';

describe('formatRemaining', () => {
  it('mm:ss로 보여준다', () => {
    expect(formatRemaining(15 * 60 * 1000)).toBe('15:00');
    expect(formatRemaining(65_500)).toBe('01:05');
  });

  it('지난 시간은 00:00', () => {
    expect(formatRemaining(-3000)).toBe('00:00');
  });
});

describe('toKstDateString', () => {
  it('UTC 15시 이후는 한국 날짜로 다음 날', () => {
    expect(toKstDateString(new Date('2026-10-07T15:30:00Z'))).toBe('2026-10-08');
    expect(toKstDateString(new Date('2026-10-07T14:59:00Z'))).toBe('2026-10-07');
  });
});
