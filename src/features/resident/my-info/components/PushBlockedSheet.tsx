import { BottomSheet } from '@/shared/ui/BottomSheet';

const GUIDES = [
  {
    title: 'iPhone (홈 화면 앱)',
    steps: ['설정 앱을 열어요', '알림 → 동네냠냠을 골라요', '알림 허용을 켜요'],
  },
  {
    title: 'Android (Chrome)',
    steps: ['주소창 왼쪽 자물쇠를 눌러요', '권한 → 알림을 골라요', '허용으로 바꿔요'],
  },
];

interface PushBlockedSheetProps {
  onClose: () => void;
}

// R12-1 알림 해제 방법 안내: 브라우저에서 막힌 알림을 다시 허용하는 법
export function PushBlockedSheet({ onClose }: PushBlockedSheetProps) {
  return (
    <BottomSheet title="알림이 막혀 있어요" onClose={onClose}>
      <p className="-mt-2 text-sm text-muted">
        브라우저 설정에서 알림을 허용하면 딜 소식을 받을 수 있어요.
      </p>
      {GUIDES.map((guide) => (
        <section key={guide.title} className="mt-4 rounded-card bg-gray p-4">
          <h3 className="text-sm font-bold">{guide.title}</h3>
          <ol className="mt-3 space-y-3">
            {guide.steps.map((step, index) => (
              <li key={step} className="flex items-center gap-3 text-sm text-muted">
                <span className="flex size-6 items-center justify-center rounded-full bg-accent-tint text-xs font-bold text-accent">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </section>
      ))}
      <button
        type="button"
        onClick={onClose}
        className="mt-4 h-[52px] w-full rounded-[12px] bg-accent font-semibold text-white"
      >
        확인했어요
      </button>
    </BottomSheet>
  );
}
