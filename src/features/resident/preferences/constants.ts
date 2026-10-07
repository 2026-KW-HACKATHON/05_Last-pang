// 「걸어갈 수 있는 거리」 3단계 (피그마 R4-2·R6-1). DB 허용 범위 200~2000m 안의 값
export const RADIUS_OPTIONS = [
  { value: 300, label: '가까이', distanceLabel: '300m' },
  { value: 800, label: '보통', distanceLabel: '800m' },
  { value: 1500, label: '넓게', distanceLabel: '1.5km' },
] as const;
