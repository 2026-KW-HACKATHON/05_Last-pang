import { PageHeader } from '@/shared/ui/PageHeader';

const TOTAL_STEPS = 4;

interface OnboardingHeaderProps {
  step: number; // 1 동의 → 2 닉네임 → 3 좋아하는 가게 → 4 알림
  isEditMode: boolean; // 내 정보에서 고치러 들어오면 단계 표시 없이 제목만
  editTitle: string;
}

export function OnboardingHeader({ step, isEditMode, editTitle }: OnboardingHeaderProps) {
  return (
    <PageHeader
      title={isEditMode ? editTitle : undefined}
      hasBack
      right={
        !isEditMode && (
          <span className="rounded-pill bg-accent-soft px-2.5 py-1 text-sm font-bold text-accent">
            {step}/{TOTAL_STEPS}
          </span>
        )
      }
    />
  );
}
