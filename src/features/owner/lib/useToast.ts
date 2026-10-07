import { useCallback, useEffect, useState } from 'react';

/** 토스트 문구 하나를 2.5초 동안 보여 준다 */
export function useToast(durationMs = 2500) {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(null), durationMs);
    return () => window.clearTimeout(timer);
  }, [message, durationMs]);

  const showToast = useCallback((text: string) => setMessage(text), []);
  return { toastMessage: message, showToast };
}
