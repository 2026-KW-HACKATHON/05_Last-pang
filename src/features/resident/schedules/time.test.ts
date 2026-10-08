import { describe, expect, it } from 'vitest';

import { formatFreeTime, toFreeRanges } from './time';

describe('비는 시간 변환', () => {
  it('요일과 분으로 바꾸고, 00:00으로 끝나면 자정으로 본다', () => {
    expect(
      toFreeRanges([
        { day: '2026-10-08', from: '13:00', to: '14:30' },
        { day: '2026-10-11', from: '20:00', to: '00:00' },
      ]),
    ).toEqual([
      { dow: 4, startMin: 780, endMin: 870 },
      { dow: 0, startMin: 1200, endMin: 1440 },
    ]);
  });

  it('구간 문구', () => {
    expect(formatFreeTime({ from: '13:00', to: '14:00' })).toBe('13:00~14:00');
    expect(formatFreeTime({ from: '21:00', to: '00:00' })).toBe('21:00~24:00');
  });
});
