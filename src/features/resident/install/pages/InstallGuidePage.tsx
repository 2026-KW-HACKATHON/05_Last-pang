import { useState } from 'react';

import { BottomBar } from '@/shared/ui/BottomBar';
import { Icon } from '@/shared/ui/Icon';
import { Mascot } from '@/shared/ui/Mascot';
import { PageHeader } from '@/shared/ui/PageHeader';

import { AlreadyInstalled } from '../components/AlreadyInstalled';
import { InAppBrowserNotice } from '../components/InAppBrowserNotice';
import { InstallSteps } from '../components/InstallSteps';
import { PlatformTabs } from '../components/PlatformTabs';
import { TroubleList } from '../components/TroubleList';
import { detectInAppBrowser, detectPlatform, isSamsungBrowser, isStandalone } from '../platform';
import { useInstallPrompt } from '../useInstallPrompt';

const TIPS = {
  ios: 'iPhone은 홈 화면에 추가해야 알림이 와요 · iOS 16.4 이상',
  android: 'Chrome에서 가장 잘 돼요 · 알림은 Chrome에서도 와요',
} as const;

// 홈 화면에 추가하는 법 (피그마 R16). 로그인 없이 열 수 있다
export function InstallGuidePage() {
  const [platform, setPlatform] = useState(detectPlatform);
  const [isInstalled] = useState(isStandalone);
  const [inAppName] = useState(detectInAppBrowser);
  const [isSamsung] = useState(isSamsungBrowser);
  const { canInstall, install } = useInstallPrompt();
  const showsInstallButton = platform === 'android' && canInstall;

  return (
    <main
      className={`mx-auto min-h-dvh max-w-[480px] bg-surface ${showsInstallButton ? 'pb-28' : 'pb-10'}`}
    >
      <PageHeader title="홈 화면에 추가하는 법" hasBack />
      {isInstalled ? (
        <AlreadyInstalled />
      ) : (
        <div className="px-5 pt-5">
          <PlatformTabs value={platform} onChange={setPlatform} />
          {inAppName ? (
            <div className="mt-4">
              <InAppBrowserNotice appName={inAppName} platform={platform} />
            </div>
          ) : (
            <Mascot pose="phone" size={96} className="mx-auto my-3" />
          )}
          <p className="mt-4 mb-3 flex items-center gap-1.5 text-[13px] text-accent">
            <Icon name="info" size={16} />
            {platform === 'android' && isSamsung
              ? '삼성 인터넷이에요 · ≡ → 현재 페이지 추가 → 홈 화면'
              : TIPS[platform]}
          </p>
          <InstallSteps platform={platform} />
          <TroubleList platform={platform} />
          {showsInstallButton && (
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
