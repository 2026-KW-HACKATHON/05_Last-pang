import { describe, expect, it } from 'vitest';

import { formatKstTime, formatRemaining, toKstDateString } from './time';

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

describe('formatKstTime', () => {
  it('기기 시간대와 상관없이 KST 24시간제', () => {
    expect(formatKstTime('2026-10-07T11:48:00Z')).toBe('20:48');
    expect(formatKstTime('2026-10-06T23:05:00Z')).toBe('08:05');
  });
});
