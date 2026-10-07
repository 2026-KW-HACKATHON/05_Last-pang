const EARTH_RADIUS_M = 6_371_000;
const WALK_M_PER_MIN = 67; // 약 4km/h, 가정치

const toRadian = (degree: number) => (degree * Math.PI) / 180;

/** 두 좌표 사이 직선거리(m). 하버사인 공식 — 지도 SDK 없이 DB(recommend_deals)와 같은 식으로 계산한다 */
export function distanceMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const deltaLat = toRadian(lat2 - lat1);
  const deltaLng = toRadian(lng2 - lng1);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadian(lat1)) * Math.cos(toRadian(lat2)) * Math.sin(deltaLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(a));
}

/** 직선거리 기준 도보 시간(분). 실제 길은 더 돌아가므로 화면에는 "약 N분"으로 쓴다 */
export function walkingMinutes(meters: number): number {
  return Math.max(1, Math.round(meters / WALK_M_PER_MIN));
}

/** 자주 있는 곳 저장용: 약 100m 단위로 흐리게 (위도 0.001° ≈ 111m). 실시간 위치는 저장하지 않는다 */
export function blurCoordinate(value: number): number {
  return Math.round(value * 1000) / 1000;
}

// 월계1동 중심 좌표 (10/1 결정) — 위치 권한 거부 시 대체값.
// 행정동 경계 그림의 중심을 광운대역·석계역 좌표 기준으로 환산한 추정값 (오차 약 ±100m)
export const WOLGYE1_CENTER = { lat: 37.6206, lng: 127.058 } as const;
