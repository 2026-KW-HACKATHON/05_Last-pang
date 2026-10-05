import { useState } from 'react';

// 키패드 배열은 순서가 곧 정체성인 고정 상수라 값 자체를 key로 쓴다 (컨벤션 7장 예외)
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'blank', '0', 'delete'] as const;
type Key = (typeof KEYS)[number];

// 버튼 글자 (중첩 삼항 대신 표로)
const KEY_LABELS: Record<Key, string> = {
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  '0': '0',
  blank: '',
  delete: '지우기',
};

interface CodeInputProps {
  length?: number;
  disabled?: boolean;
  onComplete: (code: string) => void;
}

// 사장님이 손님 폰의 쿠폰 화면에 가게 코드를 누르는 숫자 키패드.
// 시스템 키보드를 띄우지 않고, 입력한 숫자는 화면에 ●로만 보여준다
export function CodeInput({ length = 6, disabled = false, onComplete }: CodeInputProps) {
  const [digits, setDigits] = useState('');

  const handleKeyClick = (key: Key) => {
    if (disabled || key === 'blank') return;
    if (key === 'delete') {
      setDigits((prev) => prev.slice(0, -1));
      return;
    }
    const next = (digits + key).slice(0, length);
    if (next.length < length) {
      setDigits(next);
      return;
    }
    onComplete(next);
    setDigits(''); // 틀렸을 때 바로 다시 입력할 수 있게 비운다
  };

  return (
    <div>
      <p
        className="mb-4 text-center text-2xl tracking-[0.5em]"
        aria-label={`${length}자리 중 ${digits.length}자리 입력`}
      >
        {'●'.repeat(digits.length).padEnd(length, '○')}
      </p>
      <div className="grid grid-cols-3 gap-2">
        {KEYS.map((key) => (
          <button
            key={key}
            type="button"
            disabled={disabled || key === 'blank'}
            onClick={() => handleKeyClick(key)}
            aria-hidden={key === 'blank'}
            className="h-14 rounded-card bg-surface text-xl font-semibold disabled:opacity-40"
          >
            {KEY_LABELS[key]}
          </button>
        ))}
      </div>
    </div>
  );
}
