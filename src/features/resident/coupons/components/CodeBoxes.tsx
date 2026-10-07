import { CODE_LENGTH } from '../useCodeEntry';

export type CodeBoxesTone = 'normal' | 'error' | 'pending' | 'disabled';

interface CodeBoxesProps {
  digits: string;
  tone: CodeBoxesTone;
}

const SLOTS = Array.from({ length: CODE_LENGTH }, (_, position) => position);

// 가게 코드 6칸. 입력한 숫자는 ●로만 보여준다 (R8)
export function CodeBoxes({ digits, tone }: CodeBoxesProps) {
  const toSlotClass = (position: number) => {
    if (tone === 'disabled') return 'border-transparent bg-gray';
    if (tone === 'error') return 'border-danger';
    if (tone === 'pending') return 'border-accent';
    if (position === digits.length) return 'border-accent';
    return 'border-line';
  };

  return (
    <div
      className="flex justify-center gap-2"
      aria-label={`${CODE_LENGTH}자리 중 ${digits.length}자리 입력`}
    >
      {SLOTS.map((position) => (
        <span
          key={position}
          className={`flex h-14 w-12 items-center justify-center rounded-[12px] border-[1.5px] text-lg ${toSlotClass(position)}`}
        >
          {position < digits.length ? '●' : ''}
        </span>
      ))}
    </div>
  );
}
