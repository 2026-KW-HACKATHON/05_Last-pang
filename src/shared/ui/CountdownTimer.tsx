import { useEffect, useRef } from 'react';

import { useNow } from '@/shared/hooks/useNow';
import { formatRemaining } from '@/shared/lib/time';

const WARNING_MS = 60_000; // 1분 미만이면 빨간색

interface CountdownTimerProps {
  expiresAt: string;
  onExpire?: () => void;
}

// 서버가 정한 만료 시각 기준으로 센다. 기기 시계가 틀리면 오차가 생기지만, 실제 만료는 서버가 다시 확인한다
export function CountdownTimer({ expiresAt, onExpire }: CountdownTimerProps) {
  const now = useNow();
  const remainingMs = new Date(expiresAt).getTime() - now;
  const isExpired = remainingMs <= 0;
  // 만료 후에도 useNow가 매초 다시 그리므로, 부모가 onExpire를 인라인 함수로 넘기면
  // effect가 매초 다시 돈다. 만료 한 번에 onExpire도 한 번만 부르도록 기억한다
  const hasExpiredRef = useRef(false);

  useEffect(() => {
    if (!isExpired) {
      hasExpiredRef.current = false; // expiresAt이 미래로 바뀌면(새 쿠폰) 다시 알릴 수 있게
      return;
    }
    if (hasExpiredRef.current) return;
    hasExpiredRef.current = true;
    onExpire?.();
  }, [isExpired, onExpire]);

  return (
    <span
      className={`font-bold tabular-nums ${remainingMs < WARNING_MS ? 'text-danger' : 'text-ink'}`}
      role="timer"
    >
      {formatRemaining(remainingMs)}
    </span>
  );
}
