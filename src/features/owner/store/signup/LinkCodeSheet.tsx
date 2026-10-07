import { useState } from 'react';

import { AppError } from '@/shared/lib/errors';

import { BottomSheet } from '../../components/ui/BottomSheet';
import { Button } from '../../components/ui/Button';
import { NoticeBox } from '../../components/ui/NoticeBox';
import { inputClass } from '../../lib/styles';
import { useLinkStoreByCode } from '../hooks';

/** 운영자가 미리 등록한 가게를 내 계정에 잇는 8자리 코드 입력 */
export function LinkCodeSheet({
  onClose,
  onLinked,
}: {
  onClose: () => void;
  onLinked: () => void;
}) {
  const [code, setCode] = useState('');
  const link = useLinkStoreByCode();
  const normalized = code
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, '')
    .slice(0, 8);
  return (
    <BottomSheet
      title="가게 연결 코드"
      subtitle="운영자가 알려 준 8자리 코드를 입력해 주세요"
      onClose={onClose}
    >
      <div className="space-y-4">
        <input
          value={normalized}
          onChange={(event) => setCode(event.target.value)}
          placeholder="예: AB3K9QZX"
          className={`${inputClass()} text-center font-mono text-xl tracking-[6px] uppercase`}
        />
        {link.error instanceof AppError && (
          <NoticeBox tone="danger">
            {link.error.code === 'WRONG_CODE'
              ? '코드가 맞지 않아요. 다시 확인해 주세요'
              : link.error.message}
          </NoticeBox>
        )}
        <Button
          block
          disabled={normalized.length !== 8}
          isLoading={link.isPending}
          onClick={() => link.mutate(normalized, { onSuccess: onLinked })}
        >
          내 가게로 연결하기
        </Button>
      </div>
    </BottomSheet>
  );
}
