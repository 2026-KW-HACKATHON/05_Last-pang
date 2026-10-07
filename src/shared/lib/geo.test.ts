import { describe, expect, it } from 'vitest';

import { blurCoordinate, distanceMeters, walkingMinutes } from './geo';

describe('distanceMeters', () => {
  it('같은 좌표는 0m', () => {
    expect(distanceMeters(37.62, 127.05, 37.62, 127.05)).toBe(0);
  });

  it('위도 0.01° 차이는 약 1.1km', () => {
    const meters = distanceMeters(37.62, 127.05, 37.63, 127.05);
    expect(meters).toBeGreaterThan(1100);
    expect(meters).toBeLessThan(1120);
  });

  it('두 점의 순서를 바꿔도 거리는 같다', () => {
    expect(distanceMeters(37.6215, 127.0585, 37.623, 127.057)).toBeCloseTo(
      distanceMeters(37.623, 127.057, 37.6215, 127.0585),
    );
  });
});

describe('walkingMinutes', () => {
  it('가까워도 최소 1분', () => {
    expect(walkingMinutes(0)).toBe(1);
    expect(walkingMinutes(10)).toBe(1);
  });

  it('670m는 10분 (분속 67m)', () => {
    expect(walkingMinutes(670)).toBe(10);
  });
});

describe('blurCoordinate', () => {
  it('소수점 셋째 자리로 반올림한다 (약 100m 단위)', () => {
    expect(blurCoordinate(37.62349)).toBe(37.623);
    expect(blurCoordinate(127.0586)).toBe(127.059);
  });
});
