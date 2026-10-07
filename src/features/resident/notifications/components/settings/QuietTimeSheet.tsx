import { useState } from 'react';

import { BottomSheet } from '@/shared/ui/BottomSheet';
import { Icon } from '@/shared/ui/Icon';

import type { NotificationSettings } from '../../types';

type QuietTime = Pick<NotificationSettings, 'quietEnabled' | 'quietStart' | 'quietEnd'>;

const PRESETS: { label: string; value: QuietTime }[] = [
  {
    label: '22:00 ~ 08:00 (기본)',
    value: { quietEnabled: true, quietStart: '22:00', quietEnd: '08:00' },
  },
  { label: '23:00 ~ 07:00', value: { quietEnabled: true, quietStart: '23:00', quietEnd: '07:00' } },
  { label: '끄기', value: { quietEnabled: false, quietStart: '22:00', quietEnd: '08:00' } },
];

interface QuietTimeSheetProps {
  initial: QuietTime;
  isSaving: boolean;
  onSave: (value: QuietTime) => void;
  onClose: () => void;
}

// 방해 금지 시간 고르기 (R17 방해 금지 시간 선택)
export function QuietTimeSheet({ initial, isSaving, onSave, onClose }: QuietTimeSheetProps) {
  const [draft, setDraft] = useState(initial);

  const isPresetActive = (preset: QuietTime) =>
    preset.quietEnabled
      ? draft.quietEnabled &&
        draft.quietStart === preset.quietStart &&
        draft.quietEnd === preset.quietEnd
      : !draft.quietEnabled;

  const timeField = (label: string, key: 'quietStart' | 'quietEnd') => (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <span
        className={`flex h-12 items-center gap-2 rounded-[12px] px-4 ring-1 ring-line ${draft.quietEnabled ? '' : 'opacity-50'}`}
      >
        <Icon name="clock" size={18} className="text-muted" />
        <input
          type="time"
          value={draft[key]}
          onChange={(event) =>
            event.target.value &&
            setDraft((prev) => ({ ...prev, quietEnabled: true, [key]: event.target.value }))
          }
          className="flex-1 bg-transparent outline-none"
        />
      </span>
    </label>
  );

  return (
    <BottomSheet title="방해 금지 시간" onClose={onClose}>
      <p className="-mt-3 mb-4 text-sm text-muted">이 시간에는 알림을 보내지 않아요</p>
      <div className="grid grid-cols-2 gap-2">
        {timeField('시작', 'quietStart')}
        {timeField('끝', 'quietEnd')}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => setDraft(preset.value)}
            className={`rounded-pill px-4 py-2 text-sm ${
              isPresetActive(preset.value) ? 'bg-accent text-white' : 'bg-surface ring-1 ring-line'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onSave(draft)}
        disabled={isSaving || (draft.quietEnabled && draft.quietStart === draft.quietEnd)}
        className="mt-4 h-[52px] w-full rounded-[12px] bg-accent font-semibold text-white disabled:bg-accent-disabled"
      >
        저장하기
      </button>
    </BottomSheet>
  );
}
