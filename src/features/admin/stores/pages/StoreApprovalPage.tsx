// A1 입점 승인 — 대기 · 승인 · 거절 (주소 변경 요청도 대기에 함께)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/features/owner/components/ui/Button';
import { EmptyCard } from '@/features/owner/components/ui/EmptyCard';
import { NoticeBox } from '@/features/owner/components/ui/NoticeBox';
import { Segmented } from '@/features/owner/components/ui/Segmented';
import { Toast } from '@/features/owner/components/ui/Toast';
import { useToast } from '@/features/owner/lib/useToast';
import { REJECT_REASONS } from '@/features/owner/store/rejectReasons';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';

import { AdminShell } from '../../components/AdminShell';
import { ApplicationCard } from '../components/ApplicationCard';
import { ReasonSheet } from '../components/ReasonSheet';
import { useApplications, useApproveStore, useApproveStoreAddress } from '../hooks';

import type { Application, ApplicationTab } from '../api';

export function StoreApprovalPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<ApplicationTab>('pending');
  const applications = useApplications(tab);
  const approve = useApproveStore();
  const approveAddress = useApproveStoreAddress();
  const { toastMessage, showToast } = useToast();
  const [rejecting, setRejecting] = useState<Application | null>(null);
  const counts = applications.data?.counts;

  const handleApprove = (item: Application) => {
    if (item.is_address_change) {
      approveAddress.mutate(
        { storeId: item.id, isApproved: true },
        { onSuccess: () => showToast('새 주소를 승인했어요') },
      );
      return;
    }
    approve.mutate(
      { storeId: item.id, isApproved: true },
      { onSuccess: () => showToast('승인했어요. 사장님이 바로 딜을 올릴 수 있어요') },
    );
  };
  const handleReject = ({ code, note }: { code: string; note: string }) => {
    if (!rejecting) return;
    const onSuccess = () => {
      setRejecting(null);
      showToast('거절했어요');
    };
    if (rejecting.is_address_change)
      approveAddress.mutate({ storeId: rejecting.id, isApproved: false }, { onSuccess });
    else
      approve.mutate(
        { storeId: rejecting.id, isApproved: false, rejectCode: code, rejectReason: note },
        { onSuccess },
      );
  };

  return (
    <AdminShell title="입점 승인">
      <div className="space-y-4 px-5 pt-2">
        <Segmented
          value={tab}
          onChange={setTab}
          options={[
            { value: 'pending', label: '대기', count: counts?.pending, isAlert: true },
            { value: 'approved', label: '승인', count: counts?.approved },
            { value: 'rejected', label: '거절', count: counts?.rejected },
          ]}
        />
        <div className="flex items-center justify-between rounded-field border border-line px-4 py-2.5 text-[13px]">
          <span className="flex items-center gap-2 font-semibold">
            <span className="size-2 rounded-pill bg-accent" /> 실시간 입점 심사 대기
          </span>
          <span className="text-muted">
            {counts?.avg_review_min != null
              ? `평균 처리 시간 ${counts.avg_review_min}분`
              : `오늘 처리 ${counts?.reviewed_today ?? 0}건`}
          </span>
        </div>
        {applications.isPending && <LoadingState />}
        {applications.isError && (
          <ErrorState error={applications.error} onRetry={() => void applications.refetch()} />
        )}
        {applications.data?.items.length === 0 && (
          <EmptyCard
            icon="inbox"
            title={tab === 'pending' ? '기다리는 신청이 없어요' : '아직 처리한 신청이 없어요'}
            body={
              tab === 'pending'
                ? '새로운 사장님이 입점을 신청하면 이곳에 실시간으로 표시돼요.'
                : undefined
            }
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/admin/approved-stores')}
              >
                승인된 매장 목록 보기 →
              </Button>
            }
          />
        )}
        {applications.data?.items.map((item) => (
          <ApplicationCard
            key={item.id}
            item={item}
            isBusy={approve.isPending || approveAddress.isPending}
            onApprove={tab === 'pending' ? () => handleApprove(item) : undefined}
            onReject={tab === 'pending' ? () => setRejecting(item) : undefined}
          />
        ))}
        <NoticeBox icon="bulb">
          승인되면 사장님 알림함에 바로 알려 드려요. 가게 코드는 사장님이 직접 발급합니다.
        </NoticeBox>
      </div>
      {rejecting && (
        <ReasonSheet
          title="거절 사유"
          subtitle="신청 사장님께 전달될 사유를 선택해 주세요."
          reasons={REJECT_REASONS}
          notePlaceholder="직접 입력 (선택한 사유에 추가 안내할 내용을 적어주세요)"
          notice="거절하면 사장님 화면에 사유와 다시 신청하기 버튼이 바로 보여요."
          confirmLabel="거절하기"
          isPending={approve.isPending || approveAddress.isPending}
          onSubmit={handleReject}
          onClose={() => setRejecting(null)}
        />
      )}
      {toastMessage && <Toast>{toastMessage}</Toast>}
    </AdminShell>
  );
}
