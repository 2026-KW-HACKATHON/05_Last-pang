import { Link } from 'react-router-dom';

import { Icon } from '@/shared/ui/Icon';
import { Mascot } from '@/shared/ui/Mascot';

// 알림이 하나도 없을 때 (R17 알림 없음)
export function InboxEmptyState() {
  return (
    <div className="flex flex-col items-center px-8 pt-28 pb-12 text-center">
      <Mascot pose="phone" size={128} />
      <p className="mt-4 text-lg font-bold">아직 알림이 없어요</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        한가한 시간을 알려 주시면
        <br />딱 맞는 딜을 알려드려요.
      </p>
      <Link
        to="/me/schedules"
        className="mt-5 flex h-[52px] items-center gap-2 rounded-[12px] bg-accent px-8 font-semibold text-white"
      >
        <Icon name="calendar" size={18} />내 시간표 설정하기
      </Link>
    </div>
  );
}
