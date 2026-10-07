import { Icon, type IconName } from '@/shared/ui/Icon';

const STEPS: { icon: IconName; text: string }[] = [
  { icon: 'share', text: '아래 공유 버튼을 눌러요' },
  { icon: 'plusSquare', text: '‘홈 화면에 추가’를 골라요' },
  { icon: 'home', text: '홈 화면의 동네냠냠을 다시 열어요' },
];

// iPhone Safari 탭에서 열었을 때 (R17 iPhone, 홈 화면 미추가)
export function IosInstallCard() {
  return (
    <section className="rounded-card bg-surface p-4 ring-1 ring-line">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-full bg-gray text-muted">
          <Icon name="phone" size={20} />
        </span>
        <div>
          <p className="font-bold">홈 화면에 추가해야 받을 수 있어요</p>
          <p className="text-xs text-muted">iPhone은 홈 화면 앱에서만 알림이 와요</p>
        </div>
      </div>
      <ol className="mt-3 space-y-3 rounded-[12px] bg-gray p-4 text-sm">
        {STEPS.map((step, index) => (
          <li key={step.text} className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-accent-tint text-xs font-bold text-accent">
              {index + 1}
            </span>
            <Icon name={step.icon} size={16} className="text-muted" />
            {step.text}
          </li>
        ))}
      </ol>
    </section>
  );
}
