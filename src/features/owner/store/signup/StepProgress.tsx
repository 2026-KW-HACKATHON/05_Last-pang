interface StepProgressProps {
  step: 1 | 2 | 3;
  label: string;
}

/** 가게 등록 진행 표시: 원 숫자 + 3칸 막대 + 오른쪽 크림슨 글자 */
export function StepProgress({ step, label }: StepProgressProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="flex size-6 items-center justify-center rounded-pill bg-accent text-xs font-bold text-white">
          {step}
        </span>
        {[1, 2, 3].map((index) => (
          <span
            key={index}
            className={`h-1 w-7 rounded-pill ${index <= step ? 'bg-accent' : 'bg-line'}`}
          />
        ))}
      </div>
      <span className="text-[13px] text-accent">{label}</span>
    </div>
  );
}
