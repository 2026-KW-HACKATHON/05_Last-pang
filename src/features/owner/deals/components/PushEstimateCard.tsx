import { POLICY } from '@/shared/constants/policy';

import { Icon } from '../../components/Icon';
import { Card } from '../../components/ui/Card';

/** "84명 근처 주민에게 알림이 가요" (O4) */
export function PushEstimateCard({ count }: { count: number | undefined }) {
  return (
    <Card tone="tint">
      <div className="flex items-center gap-3">
        <Icon name="bell" size={24} className="text-accent" />
        <p className="text-[15px]">
          <span className="mr-1 text-2xl font-bold text-accent tabular-nums">{count ?? 0}명</span>
          근처 주민에게 알림이 가요
        </p>
      </div>
      <p className="mt-2 text-xs text-muted">
        알림은 한 사람에게 하루 {POLICY.residentDailyPush}번까지, 밤{' '}
        {Number(POLICY.quietStart.slice(0, 2)) - 12}시~아침 {Number(POLICY.quietEnd.slice(0, 2))}
        시는 보내지 않아요
      </p>
    </Card>
  );
}
