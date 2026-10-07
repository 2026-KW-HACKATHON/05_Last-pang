import { useState } from 'react';

import { Badge } from '@/features/owner/components/ui/Badge';
import { ConfirmDialog } from '@/features/owner/components/ui/ConfirmDialog';
import { formatTimeRange } from '@/features/owner/lib/format';
import { useNow } from '@/shared/hooks/useNow';
import { formatPrice } from '@/shared/lib/format';

import { useCloseDealForStore, useStoreDeals } from '../hooks';

import type { AdminDeal } from '../dealApi';

/** 운영자 관리 가게의 최근 딜 (지금 종료 가능) */
export function StoreDealsList({ storeId }: { storeId: string }) {
  const deals = useStoreDeals(storeId);
  const now = useNow(30_000);
  const closeDeal = useCloseDealForStore();
  const [closing, setClosing] = useState<AdminDeal | null>(null);
  const items = deals.data ?? [];
  if (items.length === 0) return null;
  const isOpen = (deal: AdminDeal) =>
    deal.status !== 'closed' && new Date(deal.endsAt).getTime() > now;
  return (
    <div className="space-y-2">
      <p className="text-[13px] text-muted">최근 딜</p>
      {items.map((deal) => (
        <div
          key={deal.id}
          className="flex items-center justify-between rounded-field border border-line p-3"
        >
          <div className="min-w-0">
            <p className="flex items-center gap-2 truncate font-semibold">
              {deal.title}
              {isOpen(deal) ? (
                <Badge tone="accent" withDot>
                  LIVE
                </Badge>
              ) : (
                <Badge>종료</Badge>
              )}
            </p>
            <p className="text-xs text-muted">
              {formatTimeRange(deal.startsAt, deal.endsAt)} · {formatPrice(deal.dealPrice)} · 남은{' '}
              {deal.remainingQty}/{deal.totalQty}
            </p>
          </div>
          {isOpen(deal) && (
            <button
              type="button"
              className="shrink-0 text-[13px] text-danger"
              onClick={() => setClosing(deal)}
            >
              종료
            </button>
          )}
        </div>
      ))}
      {closing && (
        <ConfirmDialog
          icon="timerOff"
          title="딜을 지금 종료할까요?"
          body="이미 받은 쿠폰은 유효시간까지 쓸 수 있어요."
          confirmLabel="종료하기"
          isPending={closeDeal.isPending}
          onConfirm={() => closeDeal.mutate(closing.id, { onSettled: () => setClosing(null) })}
          onCancel={() => setClosing(null)}
        />
      )}
    </div>
  );
}
