import { BottomSheet } from '@/shared/ui/BottomSheet';

import { KIND_CHIPS, MAX_NAME_LENGTH } from '../constants';
import { useCreateSchedule } from '../hooks';
import { OVERLAP_HINT, saveErrorMessage } from '../text';
import { formatDays, formatRange } from '../time';
import { useScheduleForm } from '../useScheduleForm';
import { DayToggles } from './DayToggles';
import { KindChips } from './KindChips';
import { OverlapNotice } from './OverlapNotice';
import { TimeRangeFields } from './TimeRangeFields';

import type { Schedule, ScheduleColor, ScheduleDraft, ScheduleKind } from '../types';

interface AddScheduleSheetProps {
  initial: ScheduleDraft;
  schedules: Schedule[];
  onClose: () => void;
  onSaved: (name: string) => void;
}

// R13-2 일정 추가 시트
export function AddScheduleSheet({ initial, schedules, onClose, onSaved }: AddScheduleSheetProps) {
  const { draft, patch, overlapText, isValid } = useScheduleForm(initial, schedules);
  const createSchedule = useCreateSchedule();

  const handleChipSelect = (kind: ScheduleKind, label: string, color: ScheduleColor) => {
    // 이름이 비었거나 다른 칩 이름 그대로면 칩 이름으로 채운다
    const isChipName = KIND_CHIPS.some((chip) => chip.label === draft.name.trim());
    patch({ kind, color, name: !draft.name.trim() || isChipName ? label : draft.name });
  };

  const handleSubmit = () => {
    createSchedule.mutate(draft, { onSuccess: () => onSaved(draft.name.trim()) });
  };

  const caption = `${formatDays(draft.days) || '요일 선택'} ${formatRange(draft.startMin, draft.endMin)}`;

  return (
    <BottomSheet title="어떤 일정인가요?" onClose={onClose}>
      <div className="max-h-[70dvh] space-y-5 overflow-y-auto pb-1">
        <p className="text-sm font-semibold text-accent">{caption}</p>

        <div>
          <label htmlFor="schedule-name" className="mb-2 block text-sm font-bold">
            일정 이름
          </label>
          <input
            id="schedule-name"
            value={draft.name}
            maxLength={MAX_NAME_LENGTH}
            onChange={(event) => patch({ name: event.target.value })}
            placeholder="예: 전공 수업"
            className="h-14 w-full rounded-[12px] px-4 ring-1 ring-line outline-none focus:ring-2 focus:ring-accent"
          />
          <div className="mt-2">
            <KindChips selected={draft.kind} onSelect={handleChipSelect} />
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-bold">반복 요일</h3>
          <DayToggles value={draft.days} onChange={(days) => patch({ days })} />
        </div>

        <TimeRangeFields
          startMin={draft.startMin}
          endMin={draft.endMin}
          onChange={(startMin, endMin) => patch({ startMin, endMin })}
        />

        {overlapText ? (
          <OverlapNotice message={overlapText} description={OVERLAP_HINT} />
        ) : createSchedule.isError ? (
          <OverlapNotice message={saveErrorMessage(createSchedule.error)} />
        ) : (
          <p className="rounded-[12px] bg-accent-tint px-4 py-3 text-sm leading-relaxed text-accent">
            이 일정 사이사이 30분 이상 비는 시간에 쓸 수 있는 딜이 열리면 바로 알려드려요
          </p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isValid || createSchedule.isPending}
          className="h-14 w-full rounded-[12px] bg-accent font-semibold text-white disabled:bg-accent-disabled"
        >
          시간표에 추가
        </button>
      </div>
    </BottomSheet>
  );
}
