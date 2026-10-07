// O7 사용 내역 — 쿠폰이 쓰일 때마다 실시간으로 4자리 확인번호가 쌓인다
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { formatPrice } from '@/shared/lib/format';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';

import { ApprovedStoreGate } from '../../components/ApprovedStoreGate';
import { Icon } from '../../components/Icon';
import { OwnerShell } from '../../components/OwnerShell';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { EmptyCard } from '../../components/ui/EmptyCard';
import { IconButton } from '../../components/ui/IconButton';
import { NoticeBox } from '../../components/ui/NoticeBox';
import { ProfileButton } from '../../components/ui/ProfileButton';
import { RootHeader } from '../../components/ui/RootHeader';
import { Segmented } from '../../components/ui/Segmented';
import { RedemptionRow } from '../components/RedemptionRow';
import { useRedemptions } from '../hooks';

import type { RedemptionRange } from '../api';
import type { MyStore } from '../../store/api';

const RANGE_LABEL: Record<RedemptionRange, string> = {
  today: '오늘',
  yesterday: '어제',
  week: '7일',
};

export function RedemptionsPage() {
  const navigate = useNavigate();
  return (
    <OwnerShell>
      <RootHeader
        title="사용 내역"
        roleLabel="사장님"
        right={
          <>
            <IconButton icon="bell" label="알림" onClick={() => navigate('/owner/notifications')} />
            <ProfileButton to="/owner/me" />
          </>
        }
      />
      <ApprovedStoreGate allowSuspended>
        {(store) => <RedemptionList store={store} />}
      </ApprovedStoreGate>
    </OwnerShell>
  );
}

function RedemptionList({ store }: { store: MyStore }) {
  const navigate = useNavigate();
  const [range, setRange] = useState<RedemptionRange>('today');
  const redemptions = useRedemptions(store.id, range);
  const items = redemptions.data ?? [];
  const total = items.reduce((sum, item) => sum + item.dealPrice, 0);

  return (
    <div className="space-y-4 px-5 pt-3">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Segmented
            value={range}
            onChange={setRange}
            options={[
              { value: 'today', label: '오늘' },
              { value: 'yesterday', label: '어제' },
              { value: 'week', label: '7일' },
            ]}
          />
        </div>
        <Badge tone="success" withDot>
          실시간 연동 중
        </Badge>
      </div>
      <Card tone="gray" className="flex items-center justify-between">
        <div>
          <p className="text-lg font-bold">
            {RANGE_LABEL[range]} {items.length}건 ·{' '}
            <span className={items.length ? 'text-accent' : 'text-faint'}>
              {formatPrice(total)}
            </span>
          </p>
          <p className="text-[13px] text-muted">실시간 사용 완료 집계</p>
        </div>
        <IconButton icon="chart" label="리포트 보기" onClick={() => navigate('/owner/report')} />
      </Card>
      {redemptions.isPending && <LoadingState />}
      {redemptions.isError && (
        <ErrorState error={redemptions.error} onRetry={() => void redemptions.refetch()} />
      )}
      {redemptions.isSuccess && items.length === 0 && (
        <EmptyCard
          icon="ticket"
          title="아직 사용된 쿠폰이 없어요"
          body="손님이 매장에서 가게 코드를 입력하고 쿠폰을 사용하면 이곳에 4자리 번호가 실시간으로 떠요."
          action={
            <button
              type="button"
              onClick={() => navigate('/owner/settings')}
              className="flex items-center gap-1 rounded-pill bg-gray px-3 py-2 text-[13px]"
            >
              <Icon name="qr" size={14} /> 매장에 가게 코드를 비치해 두셨나요? ›
            </button>
          }
        />
      )}
      {items.length > 0 && (
        <section>
          <div className="mb-2 flex justify-between text-[13px]">
            <span className="font-semibold">인증 내역 타임라인</span>
            <span className="text-muted">최신순 정렬</span>
          </div>
          <ul className="space-y-2">
            {items.map((item, index) => (
              <RedemptionRow
                key={item.couponId}
                item={item}
                isLatest={index === 0 && range === 'today'}
              />
            ))}
          </ul>
        </section>
      )}
      <NoticeBox title="사장님 확인 팁">
        손님 스마트폰 화면의 4자리 확인번호와 실시간 시계 타이머가 정상적으로 움직이는지 확인해
        주세요.
        <span className="mt-1 flex items-center gap-1">
          <Icon name="lock" size={12} /> 개인정보 보호를 위해 손님의 이름이나 연락처는 노출되지
          않습니다.
        </span>
      </NoticeBox>
    </div>
  );
}
