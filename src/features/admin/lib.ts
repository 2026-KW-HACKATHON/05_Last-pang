import { distanceMeters, WOLGYE1_CENTER } from '@/shared/lib/geo';

/** "월계1동 중심에서 410m" */
export function distanceFromCenter(lat: number, lng: number): string {
  return `월계1동 중심에서 ${Math.round(distanceMeters(WOLGYE1_CENTER.lat, WOLGYE1_CENTER.lng, lat, lng))}m`;
}

/** "서울 노원구 광운로 12, 1층" → "광운로 12" (목록용 짧은 주소) */
export function shortAddress(address: string): string {
  const road = address.split(',')[0] ?? address;
  const parts = road.trim().split(' ');
  return parts.slice(-2).join(' ');
}

/** 사업자번호 1234567890 → 123-45-67890 */
export function formatBusinessNumber(value: string | null): string {
  if (!value) return '–';
  return `${value.slice(0, 3)}-${value.slice(3, 5)}-${value.slice(5)}`;
}
