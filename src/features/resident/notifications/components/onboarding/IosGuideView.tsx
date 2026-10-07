import { Icon, type IconName } from '@/shared/ui/Icon';

import { OnboardingHero } from './OnboardingHero';

const STEPS: { icon: IconName; text: string }[] = [
  { icon: 'share', text: '아래 공유 버튼을 눌러요' },
  { icon: 'plusSquare', text: '‘홈 화면에 추가’를 골라요' },
  { icon: 'meal', text: '홈 화면의 동네냠냠을 열어요' },
];

interface IosGuideViewProps {
  onConfirm: () => void;
  onSkip: () => void;
}

// iPhone Safari 탭에서는 홈 화면 앱에서만 알림이 와서 설치부터 안내한다 (R5 아이폰 Safari 안내)
export function IosGuideView({ onConfirm, onSkip }: IosGuideViewProps) {
  return (
    <div className="px-5 pt-6 pb-8">
      <OnboardingHero />
      <section className="mt-6 rounded-card bg-surface p-5 ring-1 ring-line">
        <p className="flex items-center gap-1.5 font-bold text-accent">
          <Icon name="info" size={18} />홈 화면에 추가해야 알림을 받을 수 있어요
        </p>
        <ol className="mt-2 divide-y divide-line">
          {STEPS.map((step, index) => (
            <li key={step.text} className="flex items-center gap-3 py-3">
              <span className="flex size-7 items-center justify-center rounded-full text-sm font-bold ring-1 ring-line">
                {index + 1}
              </span>
              <span className="flex size-8 items-center justify-center rounded-lg bg-accent-tint text-accent">
                <Icon name={step.icon} size={18} />
              </span>
              {step.text}
            </li>
          ))}
        </ol>
      </section>
      <button
        type="button"
        onClick={onConfirm}
        className="mt-10 h-[52px] w-full rounded-[12px] bg-accent font-semibold text-white"
      >
        확인했어요
      </button>
      <button type="button" onClick={onSkip} className="mt-4 w-full py-2 text-sm text-muted">
        나중에 할게요
      </button>
    </div>
  );
}
