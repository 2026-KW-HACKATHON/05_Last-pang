// A3 신고·이슈 — 확인 대기 · 처리 완료
import { useState } from 'react';

import { EmptyCard } from '@/features/owner/components/ui/EmptyCard';
import { NoticeBox } from '@/features/owner/components/ui/NoticeBox';
import { Segmented } from '@/features/owner/components/ui/Segmented';
import { POLICY } from '@/shared/constants/policy';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';

import { AdminShell } from '../../components/AdminShell';
import { ReportGroupCard } from '../components/ReportGroupCard';
import { useReportGroups } from '../hooks';

import type { ReportTab } from '../api';

export function ReportsPage() {
  const [tab, setTab] = useState<ReportTab>('pending');
  const groups = useReportGroups(tab);
  const counts = groups.data?.counts;
  return (
    <AdminShell title="신고·이슈">
      <div className="space-y-4 px-5 pt-2">
        <Segmented
          value={tab}
          onChange={setTab}
          options={[
            { value: 'pending', label: '확인 대기', count: counts?.pending, isAlert: true },
            { value: 'resolved', label: '처리 완료', count: counts?.resolved },
          ]}
        />
        {groups.isPending && <LoadingState />}
        {groups.isError && (
          <ErrorState error={groups.error} onRetry={() => void groups.refetch()} />
        )}
        {groups.data?.items.length === 0 && (
          <EmptyCard
            icon="shieldCheck"
            title={tab === 'pending' ? '확인할 신고가 없어요' : '처리한 신고가 없어요'}
            body="새 신고가 들어오면 여기에 바로 보여요."
          />
        )}
        {groups.data?.items.map((group) => (
          <ReportGroupCard key={group.deal_id} group={group} />
        ))}
        <NoticeBox>
          같은 딜에 신고가 {POLICY.reportAutoPause}건 모이면 딜이 자동으로 멈추고 맨 위에 보여요.
        </NoticeBox>
      </div>
    </AdminShell>
  );
}
