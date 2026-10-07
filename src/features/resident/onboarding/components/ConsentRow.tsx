import { CheckCircle } from './CheckCircle';

interface ConsentRowProps {
  label: string;
  description?: string;
  isRequired: boolean;
  isChecked: boolean;
  onToggle: () => void;
}

export function ConsentRow({
  label,
  description,
  isRequired,
  isChecked,
  onToggle,
}: ConsentRowProps) {
  return (
    <label className="flex cursor-pointer items-start gap-3 py-3">
      <input type="checkbox" checked={isChecked} onChange={onToggle} className="sr-only" />
      <CheckCircle isChecked={isChecked} />
      <span className="flex-1">
        <span className={isRequired ? 'text-accent' : 'text-muted'}>
          [{isRequired ? '필수' : '선택'}]
        </span>{' '}
        {label}
        {description && <span className="mt-0.5 block text-sm text-muted">{description}</span>}
      </span>
    </label>
  );
}
