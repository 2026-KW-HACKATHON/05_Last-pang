import { Icon } from '@/shared/ui/Icon';

import { CheckCircle } from './CheckCircle';

interface ConsentRowProps {
  label: string;
  description?: string;
  isRequired: boolean;
  isChecked: boolean;
  onToggle: () => void;
  onOpenTerms: () => void;
}

// 동의 한 줄: 글자를 누르면 체크, 오른쪽 › 를 누르면 약관 시트
export function ConsentRow({
  label,
  description,
  isRequired,
  isChecked,
  onToggle,
  onOpenTerms,
}: ConsentRowProps) {
  return (
    <div className="flex items-start gap-1 py-3">
      <label className="flex flex-1 cursor-pointer items-start gap-3">
        <input type="checkbox" checked={isChecked} onChange={onToggle} className="sr-only" />
        <CheckCircle isChecked={isChecked} />
        <span className="flex-1">
          <span className={isRequired ? 'font-semibold text-accent' : 'text-muted'}>
            [{isRequired ? '필수' : '선택'}]
          </span>{' '}
          {label}
          {description && <span className="mt-0.5 block text-sm text-muted">{description}</span>}
        </span>
      </label>
      <button
        type="button"
        onClick={onOpenTerms}
        aria-label={`${label} 자세히 보기`}
        className="-mr-1 p-1 text-faint"
      >
        <Icon name="chevronRight" size={18} />
      </button>
    </div>
  );
}
