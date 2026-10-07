import { inputClass } from '../../lib/styles';

interface TimeInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

/** 30분 단위 시각 입력 ("시작 15:00") */
export function TimeInput({ label, value, onChange }: TimeInputProps) {
  return (
    <label className="relative block">
      <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[13px] text-muted">
        {label}
      </span>
      <input
        type="time"
        step={1800}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${inputClass()} pl-12 text-right font-semibold tabular-nums`}
      />
    </label>
  );
}
