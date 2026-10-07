import { Icon } from '@/shared/ui/Icon';

import { NICKNAME_MAX_LENGTH } from '../schema';

import type { UseFormRegisterReturn } from 'react-hook-form';

interface NicknameFieldProps {
  registration: UseFormRegisterReturn<'nickname'>;
  length: number;
  errorMessage?: string;
  onClear: () => void;
}

// 입력 중에도 12자를 넘겨 칠 수 있게 두고(maxLength 없음), 넘으면 아래에 이유를 보여준다 (피그마 R3)
export function NicknameField({ registration, length, errorMessage, onClear }: NicknameFieldProps) {
  return (
    <div className="mt-8">
      <div
        className={`flex h-14 items-center rounded-card px-4 ring-[1.5px] ${errorMessage ? 'ring-danger' : 'ring-line focus-within:ring-accent'}`}
      >
        <input
          {...registration}
          aria-label="닉네임"
          aria-invalid={Boolean(errorMessage)}
          autoComplete="off"
          placeholder="예) 월계맛탐험가"
          className="h-full flex-1 bg-transparent outline-none"
        />
        {length > 0 && (
          <button
            type="button"
            onClick={onClear}
            aria-label="지우기"
            className="flex size-6 items-center justify-center rounded-full bg-gray text-muted"
          >
            <Icon name="close" size={14} />
          </button>
        )}
      </div>
      <p className="mt-2 flex justify-between px-1 text-sm">
        {errorMessage ? (
          <span className="flex items-center gap-1 text-danger">
            <Icon name="info" size={16} />
            {errorMessage}
          </span>
        ) : (
          <span className="text-faint">1~{NICKNAME_MAX_LENGTH}자, 한글·영문·숫자</span>
        )}
        <span className={`font-semibold ${errorMessage ? 'text-danger' : 'text-muted'}`}>
          {length}/{NICKNAME_MAX_LENGTH}
        </span>
      </p>
    </div>
  );
}
