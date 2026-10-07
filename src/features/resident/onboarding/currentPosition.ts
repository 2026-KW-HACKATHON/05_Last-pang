import { distanceMeters, WOLGYE1_CENTER } from '@/shared/lib/geo';

// 월계1동 서비스 범위: 중심에서 1.5km 안
export const SERVICE_RADIUS_M = 1500;

export interface LatLng {
  lat: number;
  lng: number;
}

/** 버튼을 눌렀을 때만 현재 위치를 한 번 읽는다. 거부·미지원·시간 초과면 reject (저장하지 않음) */
export function readCurrentPosition(): Promise<LatLng> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      reject(new Error('unsupported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
      reject,
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 },
    );
  });
}

export function isInWolgye1({ lat, lng }: LatLng): boolean {
  return distanceMeters(lat, lng, WOLGYE1_CENTER.lat, WOLGYE1_CENTER.lng) <= SERVICE_RADIUS_M;
}
