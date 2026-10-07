import { SLOT_MIN } from '../constants';
import { toHHMM } from '../time';

interface TimeRangeFieldsProps {
  startMin: number;
  endMin: number;
  onChange: (startMin: number, endMin: number) => void;
}

const FIRST_MIN = 6 * 60;
const LAST_MIN = 23 * 60 + 30;
const STEPS = Array.from(
  { length: (LAST_MIN - FIRST_MIN) / SLOT_MIN + 1 },
  (_, index) => FIRST_MIN + index * SLOT_MIN,
);

// 30분 단위 목록 + 지금 값(30분 단위가 아닌 옛 값도 보이게)
function optionsWith(steps: number[], value: number) {
  return steps.includes(value) ? steps : [...steps, value].sort((a, b) => a - b);
}

interface TimeSelectProps {
  label: string;
  value: number;
  options: number[];
  onChange: (minutes: number) => void;
}

function TimeSelect({ label, value, options, onChange }: TimeSelectProps) {
  return (
    <label className="flex h-14 items-center justify-between rounded-[12px] px-4 ring-1 ring-line focus-within:ring-accent">
      <span className="text-sm text-muted">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="appearance-none bg-transparent text-right text-lg font-bold outline-none"
      >
        {optionsWith(options, value).map((minutes) => (
          <option key={minutes} value={minutes}>
            {toHHMM(minutes)}
          </option>
        ))}
      </select>
    </label>
  );
}

// 시작·끝 시각. 시작을 끝 뒤로 옮기면 끝도 1시간 뒤로 따라간다
export function TimeRangeFields({ startMin, endMin, onChange }: TimeRangeFieldsProps) {
  const handleStartChange = (nextStart: number) => {
    const nextEnd = endMin > nextStart ? endMin : Math.min(nextStart + 60, LAST_MIN);
    onChange(nextStart, nextEnd);
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <TimeSelect
        label="시작"
        value={startMin}
        options={STEPS.filter((minutes) => minutes < LAST_MIN)}
        onChange={handleStartChange}
      />
      <TimeSelect
        label="끝"
        value={endMin}
        options={STEPS.filter((minutes) => minutes > startMin)}
        onChange={(nextEnd) => onChange(startMin, nextEnd)}
      />
    </div>
  );
}
