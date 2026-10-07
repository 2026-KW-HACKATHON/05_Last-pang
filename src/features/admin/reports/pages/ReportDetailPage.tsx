// A3 신고 상세 · 확정 확인 — 확정하면 딜 종료 + 가게 확정 1회, 3회면 이용 정지 / 기각하면 딜을 다시 연다
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Badge } from '@/features/owner/components/ui/Badge';
import { Button } from '@/features/owner/components/ui/Button';
import { ConfirmDialog } from '@/features/owner/components/ui/ConfirmDialog';
import { StickyBar } from '@/features/owner/components/ui/StickyBar';
import { TopBar } from '@/features/owner/components/ui/TopBar';
import { formatClock, formatRelativeDay, formatTimeRange } from '@/features/owner/lib/format';
import { POLICY, reportReasonLabel } from '@/shared/constants/policy';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';

import { useReportDetail, useResolveReports } from '../hooks';

export function ReportDetailPage() {
  const { dealId = '' } = useParams();
  const navigate = useNavigate();
  const detail = useReportDetail(dealId);
  const resolve = useResolveReports();
  const [isConfirming, setIsConfirming] = useState(false);

  if (detail.isPending) return <LoadingState />;
  if (detail.isError)
    return <ErrorState error={detail.error} onRetry={() => void detail.refetch()} />;
  const { deal, store, reports } = detail.data;
  const hasPending = reports.some((report) => report.status === 'pending');
  const nextCount = store.confirmed_report_count + 1;
  const done = () => navigate('/admin/reports', { replace: true });

  return (
    <div className="mx-auto min-h-dvh max-w-[480px] pb-28">
      <TopBar title="신고 상세" backTo="/admin/reports" />
      <div className="space-y-5 px-5 pt-5">
        <section className="rounded-card border border-line p-4">
          <p className="flex items-center gap-2">
            {deal.status === 'paused' && <Badge tone="danger">신고 중지</Badge>}
            <span className="text-[13px] text-muted">{store.name}</span>
          </p>
          <h1 className="mt-1 text-lg font-bold">{deal.title}</h1>
          <p className="text-[13px] text-muted">
            {formatRelativeDay(deal.starts_at)} {formatTimeRange(deal.starts_at, deal.ends_at)} ·
            쿠폰 사용 {deal.used_count}/{deal.total_qty}
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-base font-semibold">신고 사유 {reports.length}건</h2>
          <ul className="space-y-2">
            {reports.map((report) => (
              <li key={report.id} className="rounded-field border border-line p-3">
                <p className="flex justify-between text-[15px] font-semibold">
                  {reportReasonLabel(report.reason)}{' '}
                  <span className="text-[13px] font-normal text-muted">
                    {formatClock(report.created_at)}
                  </span>
                </p>
                {report.detail && <p className="mt-1 text-sm text-muted">“{report.detail}”</p>}
              </li>
            ))}
          </ul>
        </section>
        <div className="flex items-center justify-between rounded-field bg-gray p-4">
          <span className="text-sm text-muted">이 가게의 신고 확정</span>
          <b className="text-lg text-accent">
            {store.confirmed_report_count} / {POLICY.confirmedReportsSuspend}회
          </b>
        </div>
      </div>
      {hasPending && (
        <StickyBar>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              isLoading={resolve.isPending && resolve.variables?.isConfirmed === false}
              onClick={() => resolve.mutate({ dealId, isConfirmed: false }, { onSuccess: done })}
            >
              기각 · 딜 다시 열기
            </Button>
            <Button onClick={() => setIsConfirming(true)}>신고 확정</Button>
          </div>
        </StickyBar>
      )}
      {isConfirming && (
        <ConfirmDialog
          icon="flag"
          title="신고를 확정할까요?"
          body={`딜이 종료되고 이 가게의 신고 확정이 ${nextCount}회가 돼요.\n${POLICY.confirmedReportsSuspend}회가 되면 가게 이용이 정지돼요.`}
          confirmLabel="확정하기"
          isPending={resolve.isPending}
          onConfirm={() => resolve.mutate({ dealId, isConfirmed: true }, { onSuccess: done })}
          onCancel={() => setIsConfirming(false)}
        />
      )}
    </div>
  );
}
