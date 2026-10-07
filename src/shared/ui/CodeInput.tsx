import { useState } from 'react';

import { Icon } from './Icon';

// 키패드 배열은 순서가 곧 정체성인 고정 상수라 값 자체를 key로 쓴다 (컨벤션 7장 예외)
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'delete'] as const;
type Key = (typeof KEYS)[number];

interface CodeInputProps {
  length?: number;
  disabled?: boolean;
  hasError?: boolean;
  onComplete: (code: string) => void;
}

// 주민이 매장에서 사장님께 들은 가게 코드를 자기 폰에 누르는 숫자 키패드.
// 시스템 키보드를 띄우지 않고, 입력한 숫자는 화면에 ●로만 보여준다
export function CodeInput({
  length = 6,
  disabled = false,
  hasError = false,
  onComplete,
}: CodeInputProps) {
  const [digits, setDigits] = useState('');
  const slots = Array.from({ length }, (_, position) => position);

  const handleKeyClick = (key: Key) => {
    if (disabled) return;
    if (key === 'clear') {
      setDigits('');
      return;
    }
    if (key === 'delete') {
      setDigits((prev) => prev.slice(0, -1));
      return;
    }
    // 다 채운 뒤(틀린 코드를 보여주는 중)에 누르면 처음부터 다시 입력한다
    const next = digits.length >= length ? key : digits + key;
    setDigits(next);
    if (next.length === length) onComplete(next);
  };

  const toSlotClass = (position: number) => {
    if (disabled) return 'border-transparent bg-cream';
    if (hasError && digits.length === length) return 'border-danger';
    if (position === digits.length) return 'border-accent';
    return 'border-line';
  };

  return (
    <div>
      <div
        className="mb-4 flex justify-center gap-2"
        aria-label={`${length}자리 중 ${digits.length}자리 입력`}
      >
        {slots.map((position) => (
          <span
            key={position}
            className={`flex size-12 items-center justify-center rounded-xl border-[1.5px] bg-surface text-xl ${toSlotClass(position)}`}
          >
            {position < digits.length ? '●' : ''}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {KEYS.map((key) => (
          <button
            key={key}
            type="button"
            disabled={disabled}
            onClick={() => handleKeyClick(key)}
            aria-label={key === 'delete' ? '한 자리 지우기' : undefined}
            className={`flex h-13 items-center justify-center rounded-xl border border-line bg-surface font-semibold disabled:text-muted ${key === 'clear' ? 'text-sm text-sub' : 'text-xl'}`}
          >
            {key === 'delete' && <Icon name="backspace" size={24} />}
            {key === 'clear' && '전체 지우기'}
            {key !== 'delete' && key !== 'clear' && key}
          </button>
        ))}
      </div>
    </div>
  );
}
