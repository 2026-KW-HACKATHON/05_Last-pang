import { Icon } from '@/shared/ui/Icon';

import { SettingToggleRow } from './SettingToggleRow';

import type { NotificationSettings } from '../../types';

interface QuietTimeCardProps {
  settings: NotificationSettings;
  onQuietTimeClick: () => void;
  onChange: (patch: Partial<NotificationSettings>) => void;
}

// 방해 금지 시간 · 위치 함께 쓰기 (R17 알림 설정)
export function QuietTimeCard({ settings, onQuietTimeClick, onChange }: QuietTimeCardProps) {
  return (
    <section className="divide-y divide-line rounded-card bg-surface ring-1 ring-line">
      <button
        type="button"
        onClick={onQuietTimeClick}
        className="flex w-full items-center px-5 py-4 text-left"
      >
        <span className="flex-1">방해 금지 시간</span>
        <span className="text-sm text-muted">
          {settings.quietEnabled ? `${settings.quietStart} ~ ${settings.quietEnd}` : '꺼짐'}
        </span>
        <Icon name="chevronRight" size={18} className="ml-2 text-faint" />
      </button>
      <SettingToggleRow
        title="위치 함께 쓰기"
        description="켜면 걸어갈 수 있는 거리 안의 딜만 알려요"
        checked={settings.useLocation}
        onChange={(checked) => onChange({ useLocation: checked })}
      />
    </section>
  );
}
