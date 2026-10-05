// O7 사용 내역 — 손님 화면의 확인번호 4자리와 맞춰 보는 화면. 손님 이름은 보여 주지 않는다
import { useState } from 'react';

import { useNow } from '@/shared/hooks/useNow';
import { formatPrice } from '@/shared/lib/format';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';

import { ApprovedStoreGate } from '../../components/ApprovedStoreGate';
import { Icon } from '../../components/Icon';
import { OwnerShell } from '../../components/OwnerTabBar';
import { Badge, Card, PageTitle, Segmented, StatusBlock } from '../../components/ui';
import { formatClock } from '../../lib/format';
import { useRedemptions } from '../hooks';

import type { RedemptionRange } from '../api';

const RANGES: ReadonlyArray<{ value: RedemptionRange; label: string }> = [
  { value: 'today', label: '오늘' },
  { value: 'yesterday', label: '어제' },
  { value: 'week', label: '7일' },
];
const JUST_NOW_MS = 2 * 60_000;

export function RedemptionsPage() {
  return (
    <OwnerShell>
      <PageTitle>사용 내역</PageTitle>
      <ApprovedStoreGate>{(store) => <RedemptionList storeId={store.id} />}</ApprovedStoreGate>
    </OwnerShell>
  );
}

function RedemptionList({ storeId }: { storeId: string }) {
  const [range, setRange] = useState<RedemptionRange>('today');
  const redemptions = useRedemptions(storeId, range);
  const now = useNow(30_000);

  const items = redemptions.data ?? [];
  const total = items.reduce((sum, item) => sum + item.dealPrice, 0);
  const rangeLabel = RANGES.find((option) => option.value === range)?.label ?? '';

  return (
    <div className="space-y-4 px-5">
      <Segmented options={RANGES} value={range} onChange={setRange} />

      {redemptions.isPending && <LoadingState />}
      {redemptions.isError && (
        <ErrorState error={redemptions.error} onRetry={() => void redemptions.refetch()} />
      )}

      {redemptions.isSuccess && items.length === 0 && (
        <StatusBlock pose="wave" title="아직 사용된 쿠폰이 없어요" />
      )}

      {items.length > 0 && (
        <>
          <p className="text-[15px]">
            {rangeLabel} <span className="font-semibold">{items.length}건</span> ·{' '}
            <span className="font-semibold text-accent">{formatPrice(total)}</span>
          </p>
          <ul className="space-y-2">
            {items.map((item, index) => {
              const isJustNow = index === 0 && now - new Date(item.usedAt).getTime() < JUST_NOW_MS;
              return (
                <li
                  key={item.couponId}
                  className={`flex items-center gap-4 rounded-card border p-4 ${isJustNow ? 'border-accent/30 bg-accent-tint' : 'border-line bg-surface'}`}
                >
                  <span className="w-12 text-[15px] text-muted tabular-nums">
                    {formatClock(item.usedAt)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2">
                      <span className="font-mono text-lg font-semibold tracking-wider">
                        {item.confirmNumber}
                      </span>
                      {isJustNow && <Badge tone="accent">방금</Badge>}
                    </p>
                    <p className="truncate text-[13px] text-muted">{item.dealTitle}</p>
                  </div>
                  <span className="text-[15px] font-semibold tabular-nums">
                    {formatPrice(item.dealPrice)}
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      )}

      <Card tinted>
        <p className="flex items-start gap-2 text-[13px] leading-[18px]">
          <Icon name="shield" size={18} className="shrink-0 text-accent" />
          손님 화면의 확인번호와 시계가 움직이는지 확인하세요
        </p>
      </Card>
    </div>
  );
}
