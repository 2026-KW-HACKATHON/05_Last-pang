import { Icon } from '@/shared/ui/Icon';

import type { CodeKey } from '../useCodeEntry';

// 키패드 배열은 순서가 곧 정체성인 고정 상수라 값 자체를 key로 쓴다
const KEYS: CodeKey[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'delete'];

interface CodeKeypadProps {
  disabled: boolean;
  onPress: (key: CodeKey) => void;
}

// 화면 숫자 키패드. 시스템 키보드를 띄우지 않는다
export function CodeKeypad({ disabled, onPress }: CodeKeypadProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {KEYS.map((key) => (
        <button
          key={key}
          type="button"
          disabled={disabled}
          onClick={() => onPress(key)}
          aria-label={key === 'delete' ? '한 자리 지우기' : undefined}
          className={`flex h-[52px] items-center justify-center rounded-[12px] bg-surface ring-1 ring-line active:bg-gray disabled:text-faint/70 ${key === 'clear' ? 'text-sm text-muted' : 'text-xl font-semibold'}`}
        >
          {key === 'delete' && <Icon name="backspace" size={24} />}
          {key === 'clear' && '전체 지우기'}
          {key !== 'delete' && key !== 'clear' && key}
        </button>
      ))}
    </div>
  );
}
