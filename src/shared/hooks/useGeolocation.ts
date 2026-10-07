import { useCallback, useEffect, useRef, useState } from 'react';

import { WOLGYE1_CENTER } from '@/shared/lib/geo';

interface GeoState {
  lat: number;
  lng: number;
  isFallback: boolean; // true면 월계1동 중심 좌표 → "위치를 허용하면 더 정확해요" 배너
  isLoading: boolean;
}

interface GeolocationResult extends GeoState {
  /** 위치 권한을 다시 요청한다 (브라우저가 이미 '차단'으로 기억하면 팝업 없이 실패한다) */
  requestPosition: () => void;
}

const isGeolocationSupported = () => typeof navigator !== 'undefined' && 'geolocation' in navigator;

/**
 * 현재 위치 한 번 조회. 권한 거부·미지원·시간 초과면 월계1동 중심으로 대체한다(컨벤션 9장).
 * 위치는 화면 계산과 RPC 입력으로만 쓰고 저장·로그하지 않는다(컨벤션 10장)
 */
export function useGeolocation(): GeolocationResult {
  // 미지원 브라우저는 처음부터 로딩 없이 대체 좌표로 시작한다 (effect 안에서 바로 setState하지 않기 위해)
  const [state, setState] = useState<GeoState>(() => ({
    ...WOLGYE1_CENTER,
    isFallback: true,
    isLoading: isGeolocationSupported(),
  }));
  // 응답 전에 화면을 떠나면 결과를 버린다
  const isActiveRef = useRef(true);

  const readPosition = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!isActiveRef.current) return;
        setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          isFallback: false,
          isLoading: false,
        });
      },
      () => {
        if (!isActiveRef.current) return;
        setState((prev) => ({ ...prev, isLoading: false }));
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 },
    );
  }, []);

  useEffect(() => {
    isActiveRef.current = true;
    if (isGeolocationSupported()) readPosition();
    return () => {
      isActiveRef.current = false;
    };
  }, [readPosition]);

  const requestPosition = useCallback(() => {
    if (!isGeolocationSupported()) return;
    setState((prev) => ({ ...prev, isLoading: true }));
    readPosition();
  }, [readPosition]);

  return { ...state, requestPosition };
}
