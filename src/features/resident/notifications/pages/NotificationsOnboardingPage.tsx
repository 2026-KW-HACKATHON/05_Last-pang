import { useNavigate, useSearchParams } from 'react-router-dom';

import { Icon, type IconName } from '@/shared/ui/Icon';
import { Mascot } from '@/shared/ui/Mascot';

import { OnboardingHeader } from '../../onboarding/components/OnboardingHeader';
import { isIosBrowserTab } from '../api';
import { usePushSubscription } from '../hooks';

// 알림 규칙 (팀 합의 3장 임시값: 하루 3회, 21시~7시 금지)
const RULES: { icon: IconName; title: string; description: string }[] = [
  { icon: 'clock', title: '한가한 시간에', description: '걸어서 갈 수 있는 동네 가게만' },
  { icon: 'bell', title: '하루 최대 3번', description: '꼭 필요한 혜택만 골라서' },
  { icon: 'shield', title: '밤 9시 ~ 아침 7시', description: '방해 없는 안심 시간' },
];

// 온보딩 4/4 알림 받기 (피그마 R5 · R5-1)
export function NotificationsOnboardingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const push = usePushSubscription();

  const isEditMode = searchParams.get('mode') === 'edit';
  const nextPath = isEditMode ? '/me' : '/';
  const isIosTab = isIosBrowserTab();

  const handleSubscribeClick = () => {
    push.subscribe(undefined, {
      onSuccess: (permission) => {
        if (permission === 'granted') navigate(nextPath, { replace: true });
      },
    });
  };

  return (
    <main className="mx-auto min-h-dvh max-w-[480px] bg-surface">
      <OnboardingHeader step={4} isEditMode={isEditMode} editTitle="알림 받기" />
      <div className="flex flex-col items-center px-5 pt-4 text-center">
        <Mascot pose="phone" size={112} />
        <h1 className="mt-4 text-2xl leading-snug font-bold">
          딱 맞는 딜이 열리면
          <br />
          바로 알려드릴게요
        </h1>
        <ul className="mt-8 w-full space-y-4 rounded-card p-5 text-left ring-1 ring-line">
          {RULES.map((rule) => (
            <li key={rule.title} className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-accent-tint text-accent">
                <Icon name={rule.icon} size={18} />
              </span>
              <p>
                <b>{rule.title}</b> <span className="text-sm text-muted">{rule.description}</span>
              </p>
            </li>
          ))}
        </ul>

        {isIosTab && (
          <p className="mt-4 w-full rounded-card bg-gray p-4 text-left text-sm text-muted">
            iPhone은 <b>홈 화면에 추가</b>한 앱에서만 알림을 받을 수 있어요. Safari 아래쪽 공유 버튼
            → 「홈 화면에 추가」 후 앱으로 다시 열어 주세요.
          </p>
        )}
        {push.permission === 'denied' && (
          <p className="mt-4 w-full rounded-card bg-accent-tint p-4 text-left text-sm text-accent">
            브라우저에서 알림이 막혀 있어요. 브라우저 설정에서 알림을 허용해 주세요. 알림 없이도
            홈에서 딜을 볼 수 있어요.
          </p>
        )}
        {push.permission === 'unsupported' && !isIosTab && (
          <p className="mt-4 w-full rounded-card bg-gray p-4 text-left text-sm text-muted">
            이 브라우저는 알림을 지원하지 않아요. 홈에서 딜을 직접 확인해 주세요.
          </p>
        )}

        <button
          type="button"
          onClick={handleSubscribeClick}
          disabled={
            push.isSubscribing ||
            isIosTab ||
            push.permission === 'denied' ||
            push.permission === 'unsupported'
          }
          className="mt-8 flex h-14 w-full items-center justify-center gap-1 rounded-card bg-accent font-semibold text-white disabled:bg-accent-tint disabled:text-faint"
        >
          알림 받기
          <Icon name="chevronRight" size={18} />
        </button>
        <button
          type="button"
          onClick={() => navigate(nextPath, { replace: true })}
          className="mt-4 text-sm text-muted"
        >
          {push.permission === 'default' ? '나중에 할게요' : '계속하기'}
        </button>
      </div>
    </main>
  );
}
