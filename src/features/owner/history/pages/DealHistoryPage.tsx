// O11 딜 기록 — 진행 중 · 예정 · 지난 딜
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';

import { ApprovedStoreGate } from '../../components/ApprovedStoreGate';
import { Icon } from '../../components/Icon';
import { OwnerShell } from '../../components/OwnerShell';
import { Button } from '../../components/ui/Button';
import { EmptyCard } from '../../components/ui/EmptyCard';
import { Segmented } from '../../components/ui/Segmented';
import { TopBar } from '../../components/ui/TopBar';
import { formatRelativeDay } from '../../lib/format';
import { HistoryDealCard } from '../components/HistoryDealCard';
import { useDealHistory } from '../hooks';

import type { HistoryDeal, HistoryTab } from '../api';
import type { MyStore } from '../../store/api';

const EMPTY_TEXT: Record<HistoryTab, string> = {
  live: '지금 진행 중인 딜이 없어요',
  scheduled: '오늘 예정된 딜이 없어요',
  past: '아직 끝난 딜이 없어요',
};

export function DealHistoryPage() {
  return (
    <ApprovedStoreGate allowSuspended>{(store) => <DealHistory store={store} />}</ApprovedStoreGate>
  );
}

/** 날짜(오늘·어제·10월 3일)별로 묶는다 */
function groupByDay(items: HistoryDeal[]): Array<{ day: string; items: HistoryDeal[] }> {
  const groups: Array<{ day: string; items: HistoryDeal[] }> = [];
  for (const item of items) {
    const day = formatRelativeDay(item.startsAt);
    const last = groups.at(-1);
    if (last && last.day === day) last.items.push(item);
    else groups.push({ day, items: [item] });
  }
  return groups;
}

function DealHistory({ store }: { store: MyStore }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<HistoryTab>('past');
  const history = useDealHistory(tab);
  const counts = history.data?.counts;

  return (
    <OwnerShell>
      <TopBar title="딜 기록" backTo="/owner" />
      <div className="space-y-4 px-5 pt-4">
        <Segmented
          value={tab}
          onChange={setTab}
          options={[
            { value: 'live', label: '진행 중', count: counts?.live },
            { value: 'scheduled', label: '예정', count: counts?.scheduled },
            { value: 'past', label: '지난 딜', count: counts?.past },
          ]}
        />
        {history.isPending && <LoadingState />}
        {history.isError && (
          <ErrorState error={history.error} onRetry={() => void history.refetch()} />
        )}
        {history.data && history.data.items.length === 0 && (
          <EmptyCard
            icon="calendar"
            title={EMPTY_TEXT[tab]}
            body="딜을 올리면 결과가 여기에 쌓여요"
            action={
              store.status === 'approved' && (
                <Button size="md" onClick={() => navigate('/owner/deals/new')}>
                  <Icon name="bolt" size={16} /> 즉시딜 올리기
                </Button>
              )
            }
          />
        )}
        {history.data &&
          groupByDay(history.data.items).map((group) => (
            <section key={group.day} className="space-y-2">
              <h2 className="text-[13px] text-muted">{group.day}</h2>
              {group.items.map((deal) => (
                <HistoryDealCard key={deal.id} deal={deal} tab={tab} category={store.category} />
              ))}
            </section>
          ))}
      </div>
    </OwnerShell>
  );
}
