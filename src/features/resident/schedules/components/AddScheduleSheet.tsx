import { BottomSheet } from '@/shared/ui/BottomSheet';

import { GRID_END_MIN, GRID_START_MIN, KIND_CHIPS, MAX_NAME_LENGTH } from '../constants';
import { useCreateSchedule } from '../hooks';
import { firstOutingMessage, OVERLAP_HINT, saveErrorMessage } from '../text';
import { firstOutingDays, formatDays, formatRange } from '../time';
import { useScheduleForm } from '../useScheduleForm';
import { DayToggles } from './DayToggles';
import { KindChips } from './KindChips';
import { OverlapNotice } from './OverlapNotice';
import { TimeRangeFields } from './TimeRangeFields';

import type { AlertSettings, Schedule, ScheduleColor, ScheduleDraft, ScheduleKind } from '../types';

interface AddScheduleSheetProps {
  initial: ScheduleDraft;
  schedules: Schedule[];
  alertSettings: AlertSettings | undefined;
  onClose: () => void;
  onSaved: (name: string) => void;
}

// R13-2 일정 추가 시트
export function AddScheduleSheet({
  initial,
  schedules,
  alertSettings,
  onClose,
  onSaved,
}: AddScheduleSheetProps) {
  const { draft, patch, overlapText, isValid } = useScheduleForm(initial, schedules);
  const createSchedule = useCreateSchedule();

  const handleChipSelect = (kind: ScheduleKind, label: string, color: ScheduleColor) => {
    // 이름이 비었거나 다른 칩 이름 그대로면 칩 이름으로 채운다
    const isChipName = KIND_CHIPS.some((chip) => chip.label === draft.name.trim());
    patch({ kind, color, name: !draft.name.trim() || isChipName ? label : draft.name });
  };

  // 아침 알림이 켜져 있고, 이 일정이 그날 첫 일정이며, 알림 시각이 방해 금지 밖일 때만 안내
  const leadMin = alertSettings?.leadMin ?? 30;
  const alertAt = draft.startMin - leadMin;
  const outingDays = firstOutingDays(schedules, draft);
  const showsOutingInfo =
    (alertSettings?.morning ?? true) &&
    outingDays.length > 0 &&
    alertAt >= GRID_START_MIN &&
    alertAt < GRID_END_MIN;

  const handleSubmit = () => {
    createSchedule.mutate(draft, { onSuccess: () => onSaved(draft.name.trim()) });
  };

  const caption = `${formatDays(draft.days) || '요일 선택'} ${formatRange(draft.startMin, draft.endMin)}`;

  return (
    <BottomSheet title="어떤 일정인가요?" onClose={onClose}>
      <div className="max-h-[70dvh] space-y-5 overflow-y-auto pb-1">
        <p className="-mt-3 text-sm font-semibold text-accent">{caption}</p>

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
          showsOutingInfo && (
            <p className="rounded-[12px] bg-accent-tint px-4 py-3 text-sm leading-relaxed text-accent">
              {firstOutingMessage(outingDays, draft.startMin, leadMin)}
            </p>
          )
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
