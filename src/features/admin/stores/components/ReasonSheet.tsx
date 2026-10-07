import { useState } from 'react';

import { BottomSheet } from '@/features/owner/components/ui/BottomSheet';
import { Button } from '@/features/owner/components/ui/Button';
import { Chip } from '@/features/owner/components/ui/Chip';
import { NoticeBox } from '@/features/owner/components/ui/NoticeBox';
import { TextArea } from '@/features/owner/components/ui/TextArea';

interface ReasonSheetProps {
  title: string;
  subtitle: string;
  reasons: ReadonlyArray<{ value: string; label: string }>;
  notePlaceholder: string;
  notice: string;
  confirmLabel: string;
  isPending: boolean;
  onSubmit: (input: { code: string; note: string }) => void;
  onClose: () => void;
}

/** 사유 고르기 시트 (A1 거절 사유 · A2 정지 사유) */
export function ReasonSheet(props: ReasonSheetProps) {
  const [code, setCode] = useState<string>(props.reasons[0]?.value ?? 'etc');
  const [note, setNote] = useState('');
  return (
    <BottomSheet title={props.title} subtitle={props.subtitle} onClose={props.onClose}>
      <div className="space-y-5">
        <div>
          <p className="mb-2 text-[13px] text-muted">주요 사유 선택</p>
          <div className="flex flex-wrap gap-2">
            {props.reasons.map((reason) => (
              <Chip
                key={reason.value}
                tone="soft"
                isSelected={code === reason.value}
                onClick={() => setCode(reason.value)}
              >
                {reason.label}
              </Chip>
            ))}
          </div>
        </div>
        <TextArea
          label="추가 안내 내용 (선택)"
          value={note}
          onChange={setNote}
          maxLength={150}
          placeholder={props.notePlaceholder}
        />
        <NoticeBox>{props.notice}</NoticeBox>
        <Button block isLoading={props.isPending} onClick={() => props.onSubmit({ code, note })}>
          {props.confirmLabel}
        </Button>
      </div>
    </BottomSheet>
  );
}
