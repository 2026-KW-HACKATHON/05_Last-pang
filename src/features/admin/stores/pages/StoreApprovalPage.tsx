// A1 입점 승인 — 운영자가 가게 신청을 승인·거절한다. 승인해도 가게 코드는 만들지 않는다 (사장님이 O6에서 발급)
import { useState } from 'react';

import { distanceMeters, WOLGYE1_CENTER } from '@/shared/lib/geo';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';
import { CategoryIcon } from '@/features/owner/components/CategoryIcon';
import { categoryLabel } from '@/features/owner/lib/category';
import {
  Badge,
  BottomSheet,
  Button,
  Card,
  Chip,
  InfoRow,
  PageTitle,
  Segmented,
  StatusBlock,
  Toast,
} from '@/features/owner/components/ui';
import { formatMonthDayTime } from '@/features/owner/lib/format';

import { useApproveStore, useStoresByStatus } from '../hooks';

import type { StoreApplication, StoreStatus } from '../api';

const REJECT_PRESETS = ['월계1동이 아니에요', '가게 정보가 부족해요', '중복 신청이에요'] as const;
const EMPTY_TEXT: Record<StoreStatus, string> = {
  pending: '기다리는 신청이 없어요',
  approved: '승인한 가게가 없어요',
  rejected: '거절한 신청이 없어요',
};

export function StoreApprovalPage() {
  const [status, setStatus] = useState<StoreStatus>('pending');
  const pending = useStoresByStatus('pending');
  const list = useStoresByStatus(status);
  const approveStore = useApproveStore();
  const [rejectTarget, setRejectTarget] = useState<StoreApplication | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2500);
  };

  const handleApprove = (store: StoreApplication) =>
    approveStore.mutate(
      { storeId: store.id, isApproved: true },
      { onSuccess: () => showToast('승인했어요. 사장님이 바로 딜을 올릴 수 있어요') },
    );

  const handleReject = (reason: string) => {
    if (!rejectTarget) return;
    approveStore.mutate(
      { storeId: rejectTarget.id, isApproved: false, rejectReason: reason },
      {
        onSuccess: () => {
          setRejectTarget(null);
          showToast('거절했어요');
        },
      },
    );
  };

  const options = [
    { value: 'pending' as const, label: `대기 ${pending.data?.length ?? 0}` },
    { value: 'approved' as const, label: '승인' },
    { value: 'rejected' as const, label: '거절' },
  ];

  return (
    <div className="mx-auto min-h-dvh max-w-[480px] pb-10">
      <PageTitle right={<Badge>운영자</Badge>}>입점 승인</PageTitle>
      <div className="space-y-4 px-5">
        <Segmented options={options} value={status} onChange={setStatus} />

        {list.isPending && <LoadingState />}
        {list.isError && <ErrorState error={list.error} onRetry={() => void list.refetch()} />}
        {list.isSuccess && list.data.length === 0 && (
          <StatusBlock pose="wave" title={EMPTY_TEXT[status]} />
        )}

        {(list.data ?? []).map((store) => (
          <ApplicationCard
            key={store.id}
            store={store}
            status={status}
            isBusy={approveStore.isPending && approveStore.variables?.storeId === store.id}
            onApprove={() => handleApprove(store)}
            onReject={() => setRejectTarget(store)}
          />
        ))}
      </div>

      {rejectTarget && (
        <RejectSheet
          storeName={rejectTarget.name}
          isPending={approveStore.isPending}
          onClose={() => setRejectTarget(null)}
          onSubmit={handleReject}
        />
      )}
      {toast && <Toast>{toast}</Toast>}
    </div>
  );
}

interface ApplicationCardProps {
  store: StoreApplication;
  status: StoreStatus;
  isBusy: boolean;
  onApprove: () => void;
  onReject: () => void;
}

function ApplicationCard({ store, status, isBusy, onApprove, onReject }: ApplicationCardProps) {
  const distance = Math.round(
    distanceMeters(WOLGYE1_CENTER.lat, WOLGYE1_CENTER.lng, store.lat, store.lng),
  );
  const isFar = distance > 2000; // 월계1동 밖일 가능성

  return (
    <Card>
      <div className="flex items-center gap-3">
        <CategoryIcon category={store.category} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[17px] font-semibold">{store.name}</p>
          <Badge tone="accent">{categoryLabel(store.category)}</Badge>
        </div>
      </div>
      <div className="mt-3 border-t border-line pt-2">
        <InfoRow label="주소" value={store.address} />
        <InfoRow label="신청자" value={store.ownerNickname ?? '닉네임 없음'} />
        <InfoRow label="신청 시각" value={formatMonthDayTime(store.createdAt)} />
        <InfoRow
          label="위치"
          value={
            <span className={isFar ? 'font-semibold text-danger' : undefined}>
              월계1동 중심에서 {distance.toLocaleString('ko-KR')}m
            </span>
          }
        />
        {status === 'rejected' && store.rejectReason && (
          <InfoRow label="거절 사유" value={store.rejectReason} />
        )}
      </div>
      {status === 'pending' && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button variant="secondary" size="sm" disabled={isBusy} onClick={onReject}>
            거절
          </Button>
          <Button size="sm" isLoading={isBusy} onClick={onApprove}>
            승인
          </Button>
        </div>
      )}
    </Card>
  );
}

function RejectSheet({
  storeName,
  isPending,
  onClose,
  onSubmit,
}: {
  storeName: string;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}) {
  const [reason, setReason] = useState('');
  return (
    <BottomSheet title={`거절 사유 · ${storeName}`} onClose={onClose}>
      <div className="flex flex-wrap gap-2">
        {REJECT_PRESETS.map((preset) => (
          <Chip key={preset} isSelected={reason === preset} onClick={() => setReason(preset)}>
            {preset}
          </Chip>
        ))}
      </div>
      <textarea
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        maxLength={100}
        rows={3}
        placeholder="직접 입력"
        className="mt-3 w-full resize-none rounded-field border border-line bg-surface p-4 text-base outline-none placeholder:text-faint focus:border-accent"
      />
      <Button
        block
        className="mt-4"
        disabled={!reason.trim()}
        isLoading={isPending}
        onClick={() => onSubmit(reason)}
      >
        거절하기
      </Button>
    </BottomSheet>
  );
}
