import { Link } from 'react-router-dom';

import { Icon } from '@/shared/ui/Icon';

import type { PushPermission } from '../types';

interface PushStatusCardProps {
  permission: PushPermission;
  isIosTab: boolean;
}

const STATUS_TEXT: Record<PushPermission, string> = {
  granted: '알림을 받고 있어요',
  default: '아직 알림을 켜지 않았어요',
  denied: '브라우저에서 알림이 막혀 있어요',
  unsupported: '이 브라우저는 알림을 지원하지 않아요',
};

// 알림 설정 카드 (피그마 R17 알림 설정)
export function PushStatusCard({ permission, isIosTab }: PushStatusCardProps) {
  return (
    <section className="rounded-card p-4 ring-1 ring-line">
      <p className="flex items-center gap-2 font-semibold">
        <Icon name="bell" size={20} className="text-accent" />
        {isIosTab ? 'iPhone은 홈 화면에 추가해야 알림을 받을 수 있어요' : STATUS_TEXT[permission]}
      </p>
      {permission === 'default' && !isIosTab && (
        <Link
          to="/onboarding/notifications?mode=edit"
          className="mt-3 flex h-11 items-center justify-center rounded-xl bg-accent font-semibold text-white"
        >
          알림 켜기
        </Link>
      )}
      {permission === 'denied' && (
        <p className="mt-2 text-sm text-muted">
          브라우저 설정 &gt; 사이트 설정 &gt; 알림에서 허용해 주세요. 알림 없이도 홈에서 딜을 볼 수
          있어요.
        </p>
      )}
      <p className="mt-3 text-xs text-faint">
        하루 최대 3건, 같은 가게는 하루 1건만 보내요. 밤 9시 ~ 아침 7시에는 보내지 않아요.
      </p>
    </section>
  );
}
