import { useCallback, useState } from 'react';

import { isInWolgye1, readCurrentPosition } from './currentPosition';

export type AreaPhase = 'form' | 'denied' | 'outside';

// 동의 직후 동네 확인: 위치를 한 번 읽어 월계1동 안이면 onInside, 아니면 R2-1 화면 단계로 바꾼다
export function useAreaCheck(onInside: () => void) {
  const [phase, setPhase] = useState<AreaPhase>('form');
  const [isChecking, setIsChecking] = useState(false);

  const check = useCallback(async () => {
    setIsChecking(true);
    try {
      const position = await readCurrentPosition();
      if (isInWolgye1(position)) {
        onInside();
        return;
      }
      setPhase('outside');
    } catch {
      setPhase('denied');
    } finally {
      setIsChecking(false);
    }
  }, [onInside]);

  return { phase, isChecking, check };
}
