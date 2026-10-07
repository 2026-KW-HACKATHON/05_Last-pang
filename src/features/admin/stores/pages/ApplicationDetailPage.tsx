// A1-1 입점 신청 상세 — 등록증 사진을 확인하기 전에는 승인할 수 없다
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Icon } from '@/features/owner/components/Icon';
import { Button } from '@/features/owner/components/ui/Button';
import { InfoRow } from '@/features/owner/components/ui/InfoRow';
import { NoticeBox } from '@/features/owner/components/ui/NoticeBox';
import { StickyBar } from '@/features/owner/components/ui/StickyBar';
import { TopBar } from '@/features/owner/components/ui/TopBar';
import { categoryLabel } from '@/features/owner/lib/category';
import { formatMonthDayTime } from '@/features/owner/lib/format';
import { REJECT_REASONS } from '@/features/owner/store/rejectReasons';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';

import { StoreSummaryHeader } from '../../components/StoreSummaryHeader';
import { distanceFromCenter, formatBusinessNumber } from '../../lib';
import { LicenseCard } from '../components/LicenseCard';
import { ReasonSheet } from '../components/ReasonSheet';
import { useAdminStore, useApproveStore } from '../hooks';

export function ApplicationDetailPage() {
  const { storeId = '' } = useParams();
  const navigate = useNavigate();
  const store = useAdminStore(storeId);
  const approve = useApproveStore();
  const [isLicenseLoaded, setIsLicenseLoaded] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  if (store.isPending) return <LoadingState />;
  if (store.isError) return <ErrorState error={store.error} onRetry={() => void store.refetch()} />;
  const item = store.data;
  const isPending = item.status === 'pending';
  const canApprove = isPending && (isLicenseLoaded || !item.license_path);
  const back = () => navigate('/admin/stores', { replace: true });

  return (
    <div className="mx-auto min-h-dvh max-w-[480px] pb-28">
      <TopBar title="입점 신청 상세" backTo="/admin/stores" />
      <div className="space-y-4 px-5 pt-5">
        <StoreSummaryHeader
          name={item.name}
          category={item.category}
          status={item.status}
          subtitle={`${item.description ?? categoryLabel(item.category)} · ${formatMonthDayTime(item.submitted_at)} 신청`}
        />
        <div className="rounded-card bg-gray px-4 py-2">
          <InfoRow label="주소" value={item.address} />
          <InfoRow
            label="위치"
            value={
              <span className="inline-flex items-center gap-1">
                <Icon name="pin" size={14} className="text-accent" />
                {distanceFromCenter(item.lat, item.lng)}
              </span>
            }
          />
          <InfoRow label="대표자" value={item.representative_name ?? '–'} />
          <InfoRow label="사업자등록번호" value={formatBusinessNumber(item.business_no)} />
          <InfoRow label="매장 전화" value={item.phone ?? '–'} />
          <InfoRow label="신청자" value={item.owner_nickname ?? '–'} />
        </div>
        <h2 className="text-base font-semibold">사업자등록증</h2>
        <LicenseCard path={item.license_path} onLoadedChange={setIsLicenseLoaded} />
        {isPending && item.license_path && !isLicenseLoaded && (
          <NoticeBox tone="danger">사진을 확인하기 전에는 승인할 수 없어요</NoticeBox>
        )}
        <NoticeBox icon="lock">
          등록증 사진은 운영자만 볼 수 있고, 승인·거절 후 30일이 지나면 지워져요.
        </NoticeBox>
      </div>
      {isPending && (
        <StickyBar>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => setIsRejecting(true)}>
              <Icon name="x" size={18} /> 거절
            </Button>
            <Button
              disabled={!canApprove}
              isLoading={approve.isPending}
              onClick={() => approve.mutate({ storeId, isApproved: true }, { onSuccess: back })}
            >
              <Icon name="check" size={18} /> 승인
            </Button>
          </div>
        </StickyBar>
      )}
      {isRejecting && (
        <ReasonSheet
          title="거절 사유"
          subtitle="신청 사장님께 전달될 사유를 선택해 주세요."
          reasons={REJECT_REASONS}
          notePlaceholder="직접 입력 (선택한 사유에 추가 안내할 내용을 적어주세요)"
          notice="거절하면 사장님 화면에 사유와 다시 신청하기 버튼이 바로 보여요."
          confirmLabel="거절하기"
          isPending={approve.isPending}
          onSubmit={({ code, note }) =>
            approve.mutate(
              { storeId, isApproved: false, rejectCode: code, rejectReason: note },
              { onSuccess: back },
            )
          }
          onClose={() => setIsRejecting(false)}
        />
      )}
    </div>
  );
}
