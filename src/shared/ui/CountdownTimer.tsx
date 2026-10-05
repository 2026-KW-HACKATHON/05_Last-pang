import { useEffect } from 'react';

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

  useEffect(() => {
    if (isExpired) onExpire?.();
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
