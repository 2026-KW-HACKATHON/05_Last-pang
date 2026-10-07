// 「걸어갈 수 있는 거리」 3단계 (피그마 R4-2·R6-1). DB 허용 범위 200~2000m 안의 값. 도보 시간은 디자인 문구 그대로
export const RADIUS_OPTIONS = [
  { value: 300, label: '가까이', distanceLabel: '300m', walkMin: 4 },
  { value: 800, label: '보통', distanceLabel: '800m', walkMin: 10 },
  { value: 1500, label: '넓게', distanceLabel: '1.5km', walkMin: 20 },
] as const;
