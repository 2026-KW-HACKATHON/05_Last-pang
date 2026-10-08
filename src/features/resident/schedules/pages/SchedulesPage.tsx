import { useCallback, useState } from 'react';

import { ErrorState } from '@/shared/ui/ErrorState';
import { Icon } from '@/shared/ui/Icon';
import { LoadingState } from '@/shared/ui/LoadingState';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Toast } from '@/shared/ui/Toast';

import { AddScheduleSheet } from '../components/AddScheduleSheet';
import { EditScheduleSheet } from '../components/EditScheduleSheet';
import { FirstScheduleOverlay } from '../components/FirstScheduleOverlay';
import { TimetableGrid } from '../components/TimetableGrid';
import { TodayFreeTimeCard } from '../components/TodayFreeTimeCard';
import { DEFAULT_COLOR } from '../constants';
import { useFreeTimes, useMySchedules } from '../hooks';
import { dowOf, todaySeoul, toFreeRanges } from '../time';

import type { DragRange, Schedule, ScheduleDraft } from '../types';

type SheetState =
  { mode: 'add'; initial: ScheduleDraft } | { mode: 'edit'; schedule: Schedule } | null;

function draftFrom(range: DragRange): ScheduleDraft {
  return {
    name: '',
    kind: null,
    color: DEFAULT_COLOR,
    days: [range.dow],
    startMin: range.startMin,
    endMin: range.endMin,
  };
}

// R13 내 시간표: 반복 일정 블록 + 오늘 비는 시간 (딜 알림을 받는 시간)
export function SchedulesPage() {
  const schedules = useMySchedules();
  const freeTimes = useFreeTimes();
  const [sheet, setSheet] = useState<SheetState>(null);
  const [isOverlayDismissed, setIsOverlayDismissed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const closeToast = useCallback(() => setToastMessage(null), []); // Toast 타이머가 다시 시작되지 않게

  const today = todaySeoul();
  const todayDow = dowOf(today);

  if (schedules.isPending) return <LoadingState />;
  if (schedules.isError) {
    return <ErrorState error={schedules.error} onRetry={() => void schedules.refetch()} />;
  }

  const list = schedules.data;
  const todayItems = freeTimes.data?.filter((item) => item.day === today);
  const showsOverlay = list.length === 0 && !isOverlayDismissed && !sheet;

  const openAdd = (range: DragRange) => setSheet({ mode: 'add', initial: draftFrom(range) });
  const openAddDefault = () => openAdd({ dow: todayDow, startMin: 10 * 60, endMin: 11 * 60 });
  const closeWith = (message: string) => {
    setSheet(null);
    setToastMessage(message);
  };

  return (
    <main className="mx-auto min-h-dvh max-w-[480px] bg-surface pb-28">
      <PageHeader title="내 시간표" hasBack />

      <TodayFreeTimeCard
        todayDow={todayDow}
        items={todayItems}
        isError={freeTimes.isError}
        onRetry={() => void freeTimes.refetch()}
        hasSchedules={list.length > 0}
      />

      <div className="relative">
        <TimetableGrid
          schedules={list}
          todayDow={todayDow}
          freeRanges={list.length > 0 ? toFreeRanges(freeTimes.data ?? []) : []}
          onBlockClick={(schedule) => setSheet({ mode: 'edit', schedule })}
          onRangeSelect={openAdd}
        />
        {showsOverlay && (
          <FirstScheduleOverlay
            onAdd={openAddDefault}
            onLater={() => setIsOverlayDismissed(true)}
          />
        )}
      </div>

      {!showsOverlay && (
        <button
          type="button"
          onClick={openAddDefault}
          className="fixed right-[max(16px,calc((100vw-480px)/2+16px))] bottom-[max(24px,env(safe-area-inset-bottom))] z-20 flex h-12 items-center gap-1 rounded-pill bg-accent pr-5 pl-4 font-semibold text-white shadow-lg"
        >
          <Icon name="plus" size={18} strokeWidth={2.4} />
          일정 추가
        </button>
      )}

      {sheet?.mode === 'add' && (
        <AddScheduleSheet
          initial={sheet.initial}
          schedules={list}
          onClose={() => setSheet(null)}
          onSaved={() => closeWith('시간표에 추가했어요')}
        />
      )}
      {sheet?.mode === 'edit' && (
        <EditScheduleSheet
          key={sheet.schedule.id}
          schedule={sheet.schedule}
          schedules={list}
          onClose={() => setSheet(null)}
          onDone={closeWith}
        />
      )}
      {toastMessage && <Toast message={toastMessage} onClose={closeToast} />}
    </main>
  );
}
