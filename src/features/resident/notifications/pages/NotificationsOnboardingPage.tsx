import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { OnboardingHeader } from '../../onboarding/components/OnboardingHeader';
import { isIosBrowserTab } from '../api';
import { IosGuideView } from '../components/onboarding/IosGuideView';
import { PushDeniedView } from '../components/onboarding/PushDeniedView';
import { PushIntroView } from '../components/onboarding/PushIntroView';
import { PushUnsupportedView } from '../components/onboarding/PushUnsupportedView';
import { usePushSubscription } from '../hooks';

// 권한을 물은 뒤 허용되지 않은 결과 (R5-1)
type PromptResult = 'denied' | 'unsupported' | null;

// 온보딩 4/4 알림 받기 (피그마 R5 · R5-1). ?mode=edit면 내 정보에서 들어와 내 정보로 돌아간다
export function NotificationsOnboardingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const push = usePushSubscription();
  const [result, setResult] = useState<PromptResult>(null);

  const isEditMode = searchParams.get('mode') === 'edit';
  const finish = () => void navigate(isEditMode ? '/me' : '/', { replace: true });

  const handleSubscribe = () => {
    push.subscribe(undefined, {
      onSuccess: (permission) => {
        if (permission === 'granted') finish();
        else if (permission === 'denied' || permission === 'unsupported') setResult(permission);
        // 'default'(팝업을 그냥 닫음)는 이 화면에 남아 다시 누를 수 있게 둔다
      },
    });
  };

  const renderBody = () => {
    if (result === 'denied') return <PushDeniedView onFinish={finish} />;
    if (result === 'unsupported') return <PushUnsupportedView onFinish={finish} />;
    if (isIosBrowserTab()) return <IosGuideView onConfirm={finish} onSkip={finish} />;
    return (
      <PushIntroView
        isSubscribing={push.isSubscribing}
        onSubscribe={handleSubscribe}
        onSkip={finish}
      />
    );
  };

  return (
    <main className="mx-auto min-h-dvh max-w-[480px] bg-surface">
      <OnboardingHeader step={4} isEditMode={isEditMode} editTitle="알림 받기" />
      {renderBody()}
    </main>
  );
}
