import { Icon, type IconName } from '@/shared/ui/Icon';

import type { Platform } from '../platform';

const STEPS: Record<Platform, { icon: IconName; text: string }[]> = {
  ios: [
    { icon: 'share', text: '아래 공유 버튼을 눌러요' },
    { icon: 'plusSquare', text: "'홈 화면에 추가'를 골라요" },
    { icon: 'home', text: '홈 화면의 동네냠냠을 열어요' },
  ],
  android: [
    { icon: 'more', text: '브라우저 오른쪽 위 메뉴를 눌러요' },
    { icon: 'download', text: "'앱 설치' 또는 '홈 화면에 추가'를 골라요" },
    { icon: 'home', text: '홈 화면의 동네냠냠을 열어요' },
  ],
};

interface InstallStepsProps {
  platform: Platform;
}

// 기기별 홈 화면 추가 순서 (R16)
export function InstallSteps({ platform }: InstallStepsProps) {
  return (
    <ol className="space-y-4 rounded-card p-4 ring-1 ring-line">
      {STEPS[platform].map((step, index) => (
        <li key={step.text} className="flex items-center gap-3 text-sm">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-tint text-xs font-bold text-accent">
            {index + 1}
          </span>
          <Icon name={step.icon} size={20} className="text-muted" />
          {step.text}
        </li>
      ))}
    </ol>
  );
}
