import { Icon } from '../Icon';

interface StepperProps {
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (value: number) => void;
}

export function Stepper({ value, min, max, unit, onChange }: StepperProps) {
  const stepButton =
    'flex size-11 items-center justify-center rounded-pill bg-gray disabled:opacity-30';
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        aria-label="하나 빼기"
        className={stepButton}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <Icon name="minus" size={20} />
      </button>
      <span className="min-w-14 text-center text-lg font-semibold tabular-nums">
        {value}
        {unit}
      </span>
      <button
        type="button"
        aria-label="하나 더하기"
        className={stepButton}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <Icon name="plus" size={20} />
      </button>
    </div>
  );
}
