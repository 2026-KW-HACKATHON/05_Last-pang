import { useState } from 'react';

import { toAppError } from '@/shared/lib/errors';
import { BottomSheet } from '@/shared/ui/BottomSheet';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';

import { COLOR_STYLES, MAX_NAME_LENGTH } from '../constants';
import { useDeleteSchedule, useUpdateSchedule } from '../hooks';
import { OVERLAP_HINT, saveErrorMessage, withJosa } from '../text';
import { formatDays, formatRange } from '../time';
import { useScheduleForm } from '../useScheduleForm';
import { ColorSwatches } from './ColorSwatches';
import { DayToggles } from './DayToggles';
import { OverlapNotice } from './OverlapNotice';
import { TimeRangeFields } from './TimeRangeFields';

import type { Schedule } from '../types';

interface EditScheduleSheetProps {
  schedule: Schedule;
  schedules: Schedule[];
  onClose: () => void;
  onDone: (message: string) => void;
}

// R13-3 일정 고치기·지우기
export function EditScheduleSheet({
  schedule,
  schedules,
  onClose,
  onDone,
}: EditScheduleSheetProps) {
  const { id, ...initial } = schedule;
  const { draft, patch, overlapText, isValid } = useScheduleForm(initial, schedules, id);
  const updateSchedule = useUpdateSchedule();
  const deleteSchedule = useDeleteSchedule();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleSave = () => {
    updateSchedule.mutate({ id, ...draft }, { onSuccess: () => onDone('저장했어요') });
  };

  const handleDelete = () => {
    deleteSchedule.mutate(id, {
      onSuccess: () => onDone(`${withJosa(schedule.name, '을', '를')} 지웠어요`),
    });
  };

  return (
    <BottomSheet title={schedule.name} onClose={onClose}>
      <div className="max-h-[70dvh] space-y-5 overflow-y-auto pb-1">
        <p className="flex items-center gap-1.5 text-sm text-muted">
          <span className={`size-3 rounded-[3px] ${COLOR_STYLES[draft.color].block}`} />
          {formatDays(schedule.days)} {formatRange(schedule.startMin, schedule.endMin)}
        </p>

        <div>
          <label htmlFor="schedule-edit-name" className="mb-2 block text-sm font-bold">
            일정 이름
          </label>
          <input
            id="schedule-edit-name"
            value={draft.name}
            maxLength={MAX_NAME_LENGTH}
            onChange={(event) => patch({ name: event.target.value })}
            className="h-14 w-full rounded-[12px] px-4 ring-1 ring-line outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <h3 className="mb-2 text-sm font-bold">색</h3>
          <ColorSwatches value={draft.color} onChange={(color) => patch({ color })} />
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
        ) : updateSchedule.isError ? (
          <OverlapNotice message={saveErrorMessage(updateSchedule.error)} />
        ) : (
          deleteSchedule.isError && (
            <OverlapNotice message={toAppError(deleteSchedule.error).message} />
          )
        )}

        <div className="grid grid-cols-[1fr_2fr] gap-2">
          <button
            type="button"
            onClick={() => setIsConfirmOpen(true)}
            className="h-14 rounded-[12px] font-semibold text-accent ring-1 ring-line"
          >
            지우기
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!isValid || updateSchedule.isPending}
            className="h-14 rounded-[12px] bg-accent font-semibold text-white disabled:bg-accent-disabled"
          >
            저장하기
          </button>
        </div>
      </div>

      {isConfirmOpen && (
        <ConfirmDialog
          title={`${withJosa(schedule.name, '을', '를')} 지울까요?`}
          description="이 시간에 맞춘 딜 알림이 더 이상 오지 않아요."
          confirmLabel="지우기"
          isPending={deleteSchedule.isPending}
          onConfirm={handleDelete}
          onCancel={() => setIsConfirmOpen(false)}
        />
      )}
    </BottomSheet>
  );
}
