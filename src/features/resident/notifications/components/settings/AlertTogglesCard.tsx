import { SettingToggleRow } from './SettingToggleRow';

import type { NotificationSettings } from '../../types';

type AlertKey = 'dealAlerts' | 'startAlerts' | 'notices';

const ROWS: { key: AlertKey; title: string; description: string }[] = [
  { key: 'dealAlerts', title: '딜 알림', description: '내 일정에 맞는 딜이 열리면' },
  { key: 'startAlerts', title: '시작 알림', description: '시작 전 딜이 열리면' },
  { key: 'notices', title: '서비스 공지', description: '새 동네 오픈 등' },
];

interface AlertTogglesCardProps {
  settings: NotificationSettings;
  disabled: boolean; // 기기 알림이 꺼져 있으면 눌러도 소용없으니 막는다
  onChange: (patch: Partial<NotificationSettings>) => void;
}

// 받을 알림 종류 (R17 알림 설정)
export function AlertTogglesCard({ settings, disabled, onChange }: AlertTogglesCardProps) {
  return (
    <section className="divide-y divide-line rounded-card bg-surface ring-1 ring-line">
      {ROWS.map((row) => (
        <SettingToggleRow
          key={row.key}
          title={row.title}
          description={row.description}
          checked={settings[row.key]}
          disabled={disabled}
          onChange={(checked) => onChange({ [row.key]: checked })}
        />
      ))}
    </section>
  );
}
