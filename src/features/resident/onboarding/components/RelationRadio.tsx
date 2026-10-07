export type AreaRelation = 'live' | 'work';

const OPTIONS: { value: AreaRelation; label: string }[] = [
  { value: 'live', label: '월계1동에 살아요' },
  { value: 'work', label: '월계1동 학교·직장에 다녀요' },
];

interface RelationRadioProps {
  value: AreaRelation;
  onChange: (value: AreaRelation) => void;
}

// 월계1동과 어떤 관계인지 고르는 두 칸 (피그마 R2-1)
export function RelationRadio({ value, onChange }: RelationRadioProps) {
  return (
    <div className="flex flex-col gap-3" role="radiogroup" aria-label="월계1동과의 관계">
      {OPTIONS.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(option.value)}
            className={`flex h-[52px] items-center gap-3 rounded-[12px] px-4 text-left ring-1 ${isSelected ? 'bg-accent-tint ring-accent' : 'ring-line'}`}
          >
            <span
              className={`size-6 shrink-0 rounded-full ${isSelected ? 'border-[6px] border-accent bg-white' : 'border border-line bg-white'}`}
              aria-hidden="true"
            />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
