import { Icon, type IconName } from '@/shared/ui/Icon';

import { OnboardingHero } from './OnboardingHero';

// 알림 규칙 (app_policy: 하루 3건, 22:00~08:00 방해 금지)
const RULES: { icon: IconName; title: string; description: string }[] = [
  {
    icon: 'calendar',
    title: '일정이 끝날 때와 한가한 시간에,',
    description: '내 걸음으로 갈 수 있는 가까운 동네 가게만',
  },
  { icon: 'bell', title: '하루 최대 3번', description: '꼭 필요한 혜택만 골라서' },
  { icon: 'moon', title: '밤 10시 ~ 아침 8시', description: '방해 없는 안심 시간' },
];

interface PushIntroViewProps {
  isSubscribing: boolean;
  onSubscribe: () => void;
  onSkip: () => void;
}

// 온보딩 4/4 알림 받기 기본 (R5 알림)
export function PushIntroView({ isSubscribing, onSubscribe, onSkip }: PushIntroViewProps) {
  return (
    <div className="px-5 pt-6 pb-8">
      <OnboardingHero />
      <ul className="mt-8 space-y-4 rounded-card bg-surface p-5 ring-1 ring-line">
        {RULES.map((rule, index) => (
          <li
            key={rule.title}
            className={`flex gap-3 ${index === 0 ? 'items-start' : 'items-center'}`}
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-tint text-accent">
              <Icon name={rule.icon} size={18} />
            </span>
            {index === 0 ? (
              <p>
                <b className="block">{rule.title}</b>
                <span className="text-sm text-muted">{rule.description}</span>
              </p>
            ) : (
              <p>
                <b>{rule.title}</b>
                <span className="ml-3 text-sm text-muted">{rule.description}</span>
              </p>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-4 flex items-center justify-center gap-1.5 rounded-[12px] bg-accent-tint py-3 text-sm font-semibold text-accent">
        <Icon name="shield" size={16} />
        언제든 설정 메뉴에서 자유롭게 변경할 수 있어요
      </p>
      <button
        type="button"
        onClick={onSubscribe}
        disabled={isSubscribing}
        className="mt-8 flex h-[52px] w-full items-center justify-center gap-1.5 rounded-[12px] bg-accent font-semibold text-white disabled:bg-accent-disabled"
      >
        알림 받기
        <Icon name="chevronRight" size={18} />
      </button>
      <button type="button" onClick={onSkip} className="mt-4 w-full py-2 text-sm text-muted">
        나중에 할게요
      </button>
    </div>
  );
}
