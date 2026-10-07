import { cx } from '../../lib/styles';

interface SegmentOption<T extends string> {
  value: T;
  label: string;
  count?: number;
  /** 크림슨 동그라미 배지로 개수를 보여 줄지 (대기 2 같은 "처리할 것") */
  isAlert?: boolean;
}

interface SegmentedProps<T extends string> {
  options: ReadonlyArray<SegmentOption<T>>;
  value: T;
  onChange: (value: T) => void;
}

/** 회색 트랙 안 흰 칩 (피그마 A1·A2·O7·O11 공통) */
export function Segmented<T extends string>({ options, value, onChange }: SegmentedProps<T>) {
  return (
    <div className="flex rounded-field bg-gray p-1" role="tablist">
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.value)}
            className={cx(
              'flex h-10 flex-1 items-center justify-center gap-1.5 rounded-[10px] text-[15px] transition-colors',
              isActive
                ? 'bg-surface font-semibold text-accent shadow-[0_1px_4px_rgb(0_0_0/0.08)]'
                : 'text-muted',
            )}
          >
            {option.label}
            {option.count !== undefined && option.isAlert && option.count > 0 && (
              <span className="flex size-5 items-center justify-center rounded-pill bg-accent text-[11px] font-semibold text-white">
                {option.count}
              </span>
            )}
            {option.count !== undefined && !option.isAlert && <span>{option.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
