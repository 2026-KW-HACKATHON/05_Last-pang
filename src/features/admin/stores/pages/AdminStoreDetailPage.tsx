// A2 가맹점 상세 · 정지 사유 선택 · 정지된 가게 + 운영자 관리(정보 수정 · 대신 운영 · 완전 삭제)
import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { Icon } from '@/features/owner/components/Icon';
import { Button } from '@/features/owner/components/ui/Button';
import { ConfirmDialog } from '@/features/owner/components/ui/ConfirmDialog';
import { NoticeBox } from '@/features/owner/components/ui/NoticeBox';
import { StickyBar } from '@/features/owner/components/ui/StickyBar';
import { TopBar } from '@/features/owner/components/ui/TopBar';
import { categoryLabel } from '@/features/owner/lib/category';
import { formatMonthDay } from '@/features/owner/lib/format';
import { SUSPEND_REASONS, suspendReasonLabel } from '@/features/owner/store/rejectReasons';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';

import { StoreSummaryHeader } from '../../components/StoreSummaryHeader';
import { ManagedStorePanel } from '../components/ManagedStorePanel';
import { ReasonSheet } from '../components/ReasonSheet';
import { StoreInfoBox } from '../components/StoreInfoBox';
import { StoreReportHistory } from '../components/StoreReportHistory';
import { StoreStatsRow } from '../components/StoreStatsRow';
import { useAdminStore, useDeleteAdminStore, useSuspendStore, useUnsuspendStore } from '../hooks';

export function AdminStoreDetailPage() {
  const { storeId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const store = useAdminStore(storeId);
  const suspend = useSuspendStore();
  const unsuspend = useUnsuspendStore();
  const remove = useDeleteAdminStore();
  const [sheet, setSheet] = useState<'suspend' | 'delete' | null>(null);

  if (store.isPending) return <LoadingState />;
  if (store.isError) return <ErrorState error={store.error} onRetry={() => void store.refetch()} />;
  const item = store.data;
  const isSuspended = item.status === 'suspended';

  return (
    <div className="mx-auto min-h-dvh max-w-[480px] pb-40">
      <TopBar
        title="가맹점 상세"
        backTo="/admin/approved-stores"
        right={
          <button
            type="button"
            className="flex items-center gap-1 text-sm text-muted"
            onClick={() => navigate(`/admin/approved-stores/${item.id}/edit`)}
          >
            <Icon name="edit" size={16} /> 수정
          </button>
        }
      />
      <div className="space-y-4 px-5 pt-5">
        <StoreSummaryHeader
          name={item.name}
          category={item.category}
          status={item.status}
          subtitle={item.description ?? categoryLabel(item.category)}
        />
        {searchParams.get('outOfArea') && (
          <NoticeBox tone="tint">
            이 가게는 월계1동 입점 범위(1.5km) 밖이에요. 주소를 다시 확인해 주세요.
          </NoticeBox>
        )}
        {isSuspended && (
          <NoticeBox
            tone="danger"
            icon="ban"
            title={`${item.suspended_at ? formatMonthDay(item.suspended_at.slice(0, 10)) : ''}부터 이용 정지 중`}
          >
            사유: {suspendReasonLabel(item.suspend_code)}
            {item.suspend_note && ` (${item.suspend_note})`}
          </NoticeBox>
        )}
        <StoreInfoBox store={item} />
        <StoreStatsRow store={item} />
        <StoreReportHistory store={item} />
        {!item.owner_id && <ManagedStorePanel store={item} />}
      </div>
      <StickyBar>
        {isSuspended ? (
          <Button block isLoading={unsuspend.isPending} onClick={() => unsuspend.mutate(item.id)}>
            정지 해제
          </Button>
        ) : (
          <Button variant="danger-outline" block onClick={() => setSheet('suspend')}>
            <Icon name="ban" size={18} /> 가게 이용 정지
          </Button>
        )}
        <Button variant="danger-text" block onClick={() => setSheet('delete')}>
          가게 완전히 삭제
        </Button>
      </StickyBar>
      {sheet === 'suspend' && (
        <ReasonSheet
          title="정지 사유"
          subtitle="사장님께 전달될 사유를 골라 주세요."
          reasons={SUSPEND_REASONS}
          notePlaceholder="직접 입력 (사장님께 함께 보낼 내용을 적어 주세요)"
          notice="정지하면 진행 중인 딜이 바로 멈추고 사장님에게 알림이 가요."
          confirmLabel="정지하기"
          isPending={suspend.isPending}
          onSubmit={({ code, note }) =>
            suspend.mutate({ storeId: item.id, code, note }, { onSuccess: () => setSheet(null) })
          }
          onClose={() => setSheet(null)}
        />
      )}
      {sheet === 'delete' && (
        <ConfirmDialog
          icon="trash"
          title="가게를 완전히 삭제할까요?"
          body={
            '이 가게의 딜·쿠폰·신고 기록이 함께 지워지고 되돌릴 수 없어요.\n잠시 멈추려면 "가게 이용 정지"를 써 주세요.'
          }
          confirmLabel="삭제하기"
          isDanger
          isPending={remove.isPending}
          onConfirm={() =>
            remove.mutate(item.id, {
              onSuccess: () => navigate('/admin/approved-stores', { replace: true }),
            })
          }
          onCancel={() => setSheet(null)}
        />
      )}
    </div>
  );
}
