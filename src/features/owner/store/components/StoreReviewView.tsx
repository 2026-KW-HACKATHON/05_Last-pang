import { useNavigate } from 'react-router-dom';

import { Icon } from '../../components/Icon';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { InfoRow } from '../../components/ui/InfoRow';
import { NoticeBox } from '../../components/ui/NoticeBox';
import { StatusBlock } from '../../components/ui/StatusBlock';
import { TopBar } from '../../components/ui/TopBar';
import { categoryLabel } from '../../lib/category';
import { formatMonthDayTime } from '../../lib/format';
import { StoreStatusBadge } from '../../deals/components/StoreStatusBadge';
import { rejectReasonOf } from '../rejectReasons';

import type { MyStore } from '../api';

/** O2 승인 대기 중 · 승인 거절 (사장님 홈 /owner의 상태 화면) */
export function StoreReviewView({ store }: { store: MyStore }) {
  const navigate = useNavigate();
  const isRejected = store.status === 'rejected';
  const reason = rejectReasonOf(store.rejectCode);
  return (
    <div className="mx-auto min-h-dvh max-w-[480px] pb-10">
      <TopBar title="가게 등록" backTo="/" />
      <p className="pt-6 text-center text-lg font-semibold">{store.name}</p>
      <StatusBlock
        pose="map"
        badge={<StoreStatusBadge status={store.status} />}
        title={isRejected ? '가게 등록이 거절됐어요' : '운영자가 가게 정보를\n확인하고 있어요'}
        body={
          isRejected
            ? `${store.representativeName ?? store.name} 대표님, 입력된 정보를 확인해 주세요`
            : undefined
        }
      />
      <div className="space-y-3 px-5">
        {isRejected && (
          <NoticeBox tone="danger" title="거절 사유">
            <p className="font-semibold">{reason.label}</p>
            <p className="mt-0.5 text-muted">{store.rejectReason ?? reason.detail}</p>
          </NoticeBox>
        )}
        <Card tone="gray">
          <InfoRow label="가게 이름" value={store.name} />
          <InfoRow label="업종" value={categoryLabel(store.category)} />
          <InfoRow label={isRejected ? '신청 주소' : '주소'} value={store.address} />
          <InfoRow label="신청 일시" value={formatMonthDayTime(store.submittedAt)} isStrong />
        </Card>
        {isRejected ? (
          <Card tone="gray" className="flex gap-3">
            <Icon name="pin" size={20} className="shrink-0 text-accent" />
            <div>
              <p className="text-sm font-semibold">월계1동 서비스 지원 구역</p>
              <p className="text-[13px] text-muted">
                월계1동 중심 반경 1.5km 안의 가게만 등록할 수 있어요
              </p>
            </div>
          </Card>
        ) : (
          <NoticeBox>승인되면 바로 딜을 올릴 수 있어요</NoticeBox>
        )}
        <div className="space-y-1 pt-3">
          {isRejected ? (
            <>
              <Button block onClick={() => navigate('/owner/signup?resubmit=1')}>
                정보 고쳐서 다시 신청 <Icon name="arrowRight" size={18} />
              </Button>
              <Button variant="text" block onClick={() => navigate('/')}>
                주민 화면으로 돌아가기
              </Button>
            </>
          ) : (
            <Button block onClick={() => navigate('/')}>
              주민 화면으로 돌아가기
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
