import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Toast } from '@/shared/ui/Toast';

import { isIosBrowserTab } from '../../notifications/api';
import { usePushSubscription } from '../../notifications/hooks';
import { useTurnOffPushConsent } from '../hooks';
import { PushBlockedSheet } from './PushBlockedSheet';
import { PushToggleRow } from './PushToggleRow';

interface PushSettingRowProps {
  agreedPushAt: string | null;
}

// 알림 받기: 켜면 브라우저 권한을 묻고 구독, 끄면 수신 동의만 지운다
export function PushSettingRow({ agreedPushAt }: PushSettingRowProps) {
  const navigate = useNavigate();
  const push = usePushSubscription();
  const turnOff = useTurnOffPushConsent();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const handleToastClose = useCallback(() => setToastMessage(null), []);

  const isBlocked = push.permission === 'denied';
  const isOn = push.permission === 'granted' && Boolean(agreedPushAt);

  const handleToggle = () => {
    if (isOn) {
      turnOff.mutate(undefined, { onError: () => setToastMessage('잠시 후 다시 시도해 주세요') });
      return;
    }
    if (isBlocked) {
      setIsSheetOpen(true);
      return;
    }
    if (push.permission === 'unsupported') {
      // iPhone Safari 탭에서는 홈 화면에 추가해야 알림을 받을 수 있다
      if (isIosBrowserTab()) navigate('/install-guide');
      else setToastMessage('이 브라우저는 알림을 지원하지 않아요');
      return;
    }
    push.subscribe(undefined, { onError: () => setToastMessage('잠시 후 다시 시도해 주세요') });
  };

  return (
    <>
      <PushToggleRow
        isOn={isOn}
        isBlocked={isBlocked}
        isPending={push.isSubscribing || turnOff.isPending}
        onToggle={handleToggle}
        onHelp={() => setIsSheetOpen(true)}
      />
      {isSheetOpen && <PushBlockedSheet onClose={() => setIsSheetOpen(false)} />}
      {toastMessage && <Toast message={toastMessage} onClose={handleToastClose} />}
    </>
  );
}
