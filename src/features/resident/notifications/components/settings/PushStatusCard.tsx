import { Icon } from '@/shared/ui/Icon';

import type { PushPermission } from '../../types';

interface PushStatusCardProps {
  permission: PushPermission;
  isSubscribing: boolean;
  onEnableClick: () => void;
}

// 이 기기의 알림 상태 (R17 알림 설정 꺼짐 · 허용됨)
export function PushStatusCard({ permission, isSubscribing, onEnableClick }: PushStatusCardProps) {
  if (permission === 'granted') {
    return (
      <section className="flex items-center gap-3 rounded-card bg-surface p-4 ring-1 ring-line">
        <span className="flex size-10 items-center justify-center rounded-full bg-accent-tint text-accent">
          <Icon name="bell" size={20} />
        </span>
        <div className="flex-1">
          <p className="font-bold">알림을 받고 있어요</p>
          <p className="text-xs text-muted">이 기기로 딜 소식이 와요</p>
        </div>
        <span className="flex items-center gap-1 rounded-pill bg-success-tint px-2 py-0.5 text-xs text-success">
          <span className="size-1.5 rounded-full bg-success" />
          허용
        </span>
      </section>
    );
  }

  const isUnsupported = permission === 'unsupported';
  return (
    <section className="rounded-card bg-surface p-4 ring-1 ring-line">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-full bg-gray text-muted">
          <Icon name="bellOff" size={20} />
        </span>
        <div>
          <p className="font-bold">
            {isUnsupported ? '이 브라우저에서는 알림을 받을 수 없어요' : '알림이 꺼져 있어요'}
          </p>
          <p className="text-xs text-muted">
            {isUnsupported
              ? 'Chrome이나 Safari(홈 화면에 추가)에서 열어 주세요'
              : '켜면 일정에 맞는 딜을 바로 알려드려요'}
          </p>
        </div>
      </div>
      {!isUnsupported && (
        <button
          type="button"
          onClick={onEnableClick}
          disabled={isSubscribing}
          className="mt-3 flex h-11 w-full items-center justify-center gap-1.5 rounded-[12px] bg-accent font-semibold text-white disabled:bg-accent-disabled"
        >
          <Icon name="bell" size={18} />
          알림 켜기
        </button>
      )}
    </section>
  );
}
