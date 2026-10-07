import { Icon } from '@/shared/ui/Icon';

interface CheckCircleProps {
  isChecked: boolean;
}

// 동의 항목 앞의 동그란 체크 표시 (클릭은 감싼 label이 받는다)
export function CheckCircle({ isChecked }: CheckCircleProps) {
  return (
    <span
      className={`flex size-6 shrink-0 items-center justify-center rounded-full ${isChecked ? 'bg-accent text-white' : 'bg-gray text-line'}`}
    >
      <Icon name="check" size={14} strokeWidth={3} />
    </span>
  );
}
