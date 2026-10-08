import { POLICY } from '@/shared/constants/policy';
import { ErrorState } from '@/shared/ui/ErrorState';
import { PageHeader } from '@/shared/ui/PageHeader';

import { FreeTimeWeekList } from '../components/FreeTimeWeekList';
import { useFreeTimes } from '../hooks';
import { dowOf, todaySeoul } from '../time';

const NOTES = [
  '딜 시간과 비는 시간이 30분 이상 이어서 겹칠 때만 보내요',
  '딜이 열리는 순간 바로 보내고, 알림에 겹치는 시간을 적어 드려요',
  `한 사람에게 하루 ${POLICY.residentDailyPush}번, 같은 가게는 하루 1번까지만 보내요`,
  '밤 10시~아침 8시는 비는 시간으로 치지 않고 알림도 보내지 않아요',
];

// R13-5 딜 알림 받는 시간: 시간표에서 계산한 이번 주 비는 시간
export function FreeTimesPage() {
  const freeTimes = useFreeTimes();
  const todayDow = dowOf(todaySeoul());

  return (
    <main className="mx-auto min-h-dvh max-w-[480px] bg-surface pb-10">
      <PageHeader title="딜 알림 받는 시간" hasBack />
      <div className="px-4 pt-4">
        <h1 className="text-xl leading-snug font-bold">
          시간표의 비는 시간에 쓸 수 있는 딜만 알려드려요
        </h1>

        <section className="mt-4 rounded-card px-4 py-4 ring-1 ring-line">
          <h2 className="mb-2 font-bold">이번 주 비는 시간</h2>
          {freeTimes.isPending ? (
            <div className="h-48 animate-pulse rounded-[12px] bg-gray" />
          ) : freeTimes.isError ? (
            <ErrorState error={freeTimes.error} onRetry={() => void freeTimes.refetch()} />
          ) : (
            <FreeTimeWeekList items={freeTimes.data} todayDow={todayDow} />
          )}
        </section>

        <ul className="mt-4 space-y-1 rounded-card bg-gray px-4 py-3 text-xs text-muted">
          {NOTES.map((note) => (
            <li key={note}>· {note}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}
