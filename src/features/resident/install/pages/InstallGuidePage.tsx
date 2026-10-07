import { useState } from 'react';

import { BottomBar } from '@/shared/ui/BottomBar';
import { Icon } from '@/shared/ui/Icon';
import { Mascot } from '@/shared/ui/Mascot';
import { PageHeader } from '@/shared/ui/PageHeader';

import { AlreadyInstalled } from '../components/AlreadyInstalled';
import { InstallSteps } from '../components/InstallSteps';
import { PlatformTabs } from '../components/PlatformTabs';
import { detectPlatform, isStandalone } from '../platform';
import { useInstallPrompt } from '../useInstallPrompt';

// 홈 화면에 추가하는 법 (피그마 R16). 로그인 없이 열 수 있다
export function InstallGuidePage() {
  const [platform, setPlatform] = useState(detectPlatform);
  const [isInstalled] = useState(isStandalone);
  const { canInstall, install } = useInstallPrompt();

  return (
    <main className="mx-auto min-h-dvh max-w-[480px] bg-surface">
      <PageHeader title="홈 화면에 추가하는 법" hasBack />
      {isInstalled ? (
        <AlreadyInstalled />
      ) : (
        <div className="px-5 pt-5">
          <PlatformTabs value={platform} onChange={setPlatform} />
          <Mascot pose="phone" size={120} className="mx-auto my-4" />
          <InstallSteps platform={platform} />
          {platform === 'ios' && (
            <p className="mt-4 flex items-center gap-2 rounded-card bg-accent-tint p-4 text-sm text-accent">
              <Icon name="info" size={18} />
              iPhone은 홈 화면에 추가해야 알림을 받을 수 있어요
            </p>
          )}
          {platform === 'android' && canInstall && (
            <BottomBar>
              <button
                type="button"
                onClick={() => void install()}
                className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[12px] bg-accent font-semibold text-white"
              >
                <Icon name="download" size={20} />
                바로 설치하기
              </button>
            </BottomBar>
          )}
        </div>
      )}
    </main>
  );
}
