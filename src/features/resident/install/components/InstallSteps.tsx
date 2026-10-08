import { Icon } from '@/shared/ui/Icon';

import { GUIDE_STEPS } from '../guideContent';

import type { Platform } from '../platform';

interface InstallStepsProps {
  platform: Platform;
}

// 기기별 홈 화면 추가 순서 (R16). 번호 · 아이콘 · 큰 글씨 · 작은 설명
export function InstallSteps({ platform }: InstallStepsProps) {
  const steps = GUIDE_STEPS[platform];
  return (
    <ol className="rounded-card px-4 py-2 ring-1 ring-line">
      {steps.map((step, index) => (
        <li key={step.title} className="relative flex gap-3 py-3">
          {index < steps.length - 1 && (
            <span aria-hidden className="absolute top-10 bottom-[-12px] left-3 w-px bg-line" />
          )}
          <span className="relative flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
            {index + 1}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] leading-6 font-semibold">{step.title}</p>
            <p className="mt-0.5 text-[13px] leading-5 text-muted">{step.hint}</p>
          </div>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-gray text-muted">
            <Icon name={step.icon} size={18} />
          </span>
        </li>
      ))}
    </ol>
  );
}
