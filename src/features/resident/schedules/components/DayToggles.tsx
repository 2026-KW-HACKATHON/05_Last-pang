import { WEEK_DAYS } from '../constants';

interface DayTogglesProps {
  value: number[];
  onChange: (days: number[]) => void;
}

// 반복 요일 월~일 (여러 개 고를 수 있음)
export function DayToggles({ value, onChange }: DayTogglesProps) {
  const handleToggle = (dow: number) => {
    onChange(value.includes(dow) ? value.filter((day) => day !== dow) : [...value, dow]);
  };

  return (
    <div className="grid grid-cols-7 gap-1.5" role="group" aria-label="반복 요일">
      {WEEK_DAYS.map((day) => {
        const isSelected = value.includes(day.dow);
        return (
          <button
            key={day.dow}
            type="button"
            aria-pressed={isSelected}
            onClick={() => handleToggle(day.dow)}
            className={`h-11 rounded-[10px] text-sm ${
              isSelected ? 'bg-accent font-bold text-white' : 'text-muted ring-1 ring-line'
            }`}
          >
            {day.label}
          </button>
        );
      })}
    </div>
  );
}
