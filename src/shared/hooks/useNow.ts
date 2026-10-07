import { useEffect, useState } from 'react';

/** intervalMs마다 갱신되는 현재 시각(ms) — 카운트다운처럼 화면이 시간에 따라 바뀔 때 */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timerId = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(timerId);
  }, [intervalMs]);

  return now;
}
