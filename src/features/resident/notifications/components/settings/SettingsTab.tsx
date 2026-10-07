import { useState } from 'react';

import { ErrorState } from '@/shared/ui/ErrorState';
import { Icon } from '@/shared/ui/Icon';
import { LoadingState } from '@/shared/ui/LoadingState';

import { isIosBrowserTab } from '../../api';
import { usePushSubscription } from '../../hooks';
import { useNotificationSettings, useUpdateNotificationSettings } from '../../settingsHooks';
import { AlertTogglesCard } from './AlertTogglesCard';
import { BlockedGuideSheet } from './BlockedGuideSheet';
import { IosInstallCard } from './IosInstallCard';
import { PushStatusCard } from './PushStatusCard';
import { QuietTimeCard } from './QuietTimeCard';
import { QuietTimeSheet } from './QuietTimeSheet';

import type { NotificationSettings } from '../../types';

type OpenSheet = 'quiet' | 'blocked' | null;

// 알림 설정 탭 (R17 알림 설정 꺼짐 · 허용됨 · iPhone 홈 화면 미추가)
export function SettingsTab() {
  const push = usePushSubscription();
  const settings = useNotificationSettings();
  const update = useUpdateNotificationSettings();
  const [openSheet, setOpenSheet] = useState<OpenSheet>(null);
  const isIosTab = isIosBrowserTab();

  if (settings.isPending) return <LoadingState />;
  if (settings.isError) {
    return <ErrorState error={settings.error} onRetry={() => void settings.refetch()} />;
  }

  const current = settings.data;
  const handleChange = (patch: Partial<NotificationSettings>) =>
    update.mutate({ ...current, ...patch });

  // 이미 막힌 권한은 다시 물을 수 없어 푸는 방법을 보여 준다
  const handleEnableClick = () => {
    if (push.permission === 'denied') setOpenSheet('blocked');
    else push.subscribe();
  };

  return (
    <div className="space-y-3 px-5 pt-4 pb-6">
      {isIosTab ? (
        <IosInstallCard />
      ) : (
        <PushStatusCard
          permission={push.permission}
          isSubscribing={push.isSubscribing}
          onEnableClick={handleEnableClick}
        />
      )}
      <AlertTogglesCard
        settings={current}
        disabled={push.permission !== 'granted'}
        onChange={handleChange}
      />
      <QuietTimeCard
        settings={current}
        onQuietTimeClick={() => setOpenSheet('quiet')}
        onChange={handleChange}
      />
      <p className="flex gap-2 px-1 text-xs leading-relaxed text-muted">
        <Icon name="info" size={16} className="shrink-0" />
        <span>
          하루 최대 3건, 같은 가게는 하루 1건만 보내요.
          <br />
          넘친 딜은 홈에서 볼 수 있어요.
        </span>
      </p>

      {openSheet === 'quiet' && (
        <QuietTimeSheet
          initial={current}
          isSaving={update.isPending}
          onSave={(value) => {
            handleChange(value);
            setOpenSheet(null);
          }}
          onClose={() => setOpenSheet(null)}
        />
      )}
      {openSheet === 'blocked' && <BlockedGuideSheet onClose={() => setOpenSheet(null)} />}
    </div>
  );
}
