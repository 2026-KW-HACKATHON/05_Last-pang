import { useNavigate } from 'react-router-dom';

import { formatPrice } from '@/shared/lib/format';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { InfoRow } from '../../components/ui/InfoRow';
import { StatusBlock } from '../../components/ui/StatusBlock';
import { TopBar } from '../../components/ui/TopBar';
import { formatTimeRange } from '../../lib/format';

import type { CreatedDeal } from '../api';
import type { DealDraft } from '../dealDraft';

/** O4-1 등록 완료 */
export function DealCreatedView({ created, draft }: { created: CreatedDeal; draft: DealDraft }) {
  const navigate = useNavigate();
  return (
    <div className="mx-auto min-h-dvh max-w-[480px] pb-10">
      <TopBar title="즉시딜 올리기" hideBack />
      <StatusBlock
        pose="wave"
        title="딜을 올렸어요!"
        body={
          <>
            근처 주민 <b className="text-accent">{created.push_targets}명</b>에게 알림이 가요
          </>
        }
      />
      <div className="space-y-3 px-5">
        <Card tone="gray">
          <InfoRow label="혜택" value={draft.title} />
          <InfoRow
            label="가격"
            value={
              <span className="font-semibold text-accent">{formatPrice(draft.dealPrice)}</span>
            }
          />
          <InfoRow
            label="진행 시간"
            value={`오늘 ${formatTimeRange(created.starts_at, created.ends_at)}`}
          />
          <InfoRow label="수량" value={`${draft.totalQty}개`} />
        </Card>
        <Button block onClick={() => navigate('/owner', { replace: true })}>
          홈으로
        </Button>
        <Button
          variant="secondary"
          block
          onClick={() => navigate(`/owner/deals/${created.deal_id}/preview`)}
        >
          주민에게 보이는 화면 보기
        </Button>
      </div>
    </div>
  );
}
