/** "4,500원" */
export const formatPrice = (won: number) => `${won.toLocaleString('ko-KR')}원`;

/** "약 320m" / "약 1.2km" — 직선거리라 항상 "약"을 붙인다 */
export const formatDistance = (meters: number) =>
  meters < 1000 ? `약 ${Math.round(meters)}m` : `약 ${(meters / 1000).toFixed(1)}km`;

/** 정가 대비 할인율(%) 정수 */
export const calculateDiscountRate = (originalPrice: number, dealPrice: number) =>
  Math.round((1 - dealPrice / originalPrice) * 100);
