import { Card } from '../../components/ui/Card';
import { InfoRow } from '../../components/ui/InfoRow';
import { StatTile } from '../../components/ui/StatTile';
import { toManWon } from '../../lib/format';

import type { DealResult, HistoryDeal } from '../api';

/** 끝난 딜에서 다음에 해 볼 것 한 줄 */
function insightOf(deal: HistoryDeal, result: DealResult): string {
  if (result.soldOutAfterMin !== null) {
    const hours = Math.floor(result.soldOutAfterMin / 60);
    const minutes = result.soldOutAfterMin % 60;
    const took = hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;
    return `시작 ${took} 만에 모두 소진됐어요. 다음엔 수량을 조금 늘려 보세요.`;
  }
  if (result.usedCount === 0) return '이번엔 쓴 손님이 없었어요. 할인 폭이나 시간대를 바꿔 보세요.';
  const rate = Math.round((result.usedCount / deal.totalQty) * 100);
  return `준비한 수량의 ${rate}%가 쓰였어요. 비슷한 시간대에 다시 올려 보세요.`;
}

/** O12 끝난 딜 결과 */
export function DealResultPanel({ deal, result }: { deal: HistoryDeal; result: DealResult }) {
  return (
    <div className="space-y-3">
      <Card tone="gray" className="grid grid-cols-3 gap-2 p-3">
        <StatTile label="쿠폰 사용" value={result.usedCount} unit="건" isAccent />
        <StatTile label="예상 매출" value={toManWon(result.estimatedRevenue)} unit="만" />
        <StatTile label="처음 손님" value={result.newVisitorCount} unit="명" />
      </Card>
      <p className="rounded-field bg-accent-tint p-3.5 text-sm leading-[21px]">
        ⚡ {insightOf(deal, result)}
      </p>
      <Card tone="gray">
        <InfoRow label="받은 주민" value={`${result.claimedUsers}명`} />
        <InfoRow label="시간 지나 반환" value={`${result.expiredCount}명`} />
        <InfoRow label="알림 받은 주민" value={`${result.pushSentCount}명`} />
      </Card>
    </div>
  );
}
