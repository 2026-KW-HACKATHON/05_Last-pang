import { useCallback, useSyncExternalStore } from 'react';

// 표준 DOM 타입에 아직 없는 Chrome 전용 이벤트
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// beforeinstallprompt는 앱 시작 직후 한 번 오므로 화면이 열리기 전부터 모듈에서 붙잡아 둔다
let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event as BeforeInstallPromptEvent;
    notify();
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    notify();
  });
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** Android Chrome의 "앱 설치" 창. 브라우저가 지원하지 않으면 canInstall이 false */
export function useInstallPrompt() {
  const prompt = useSyncExternalStore(subscribe, () => deferredPrompt);

  const install = useCallback(async () => {
    if (!deferredPrompt) return;
    const event = deferredPrompt;
    // 한 번 쓴 이벤트는 다시 쓸 수 없다
    deferredPrompt = null;
    notify();
    await event.prompt();
  }, []);

  return { canInstall: prompt !== null, install };
}
