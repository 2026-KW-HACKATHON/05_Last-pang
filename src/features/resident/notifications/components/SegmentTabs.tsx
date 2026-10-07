export type NotificationsTab = 'inbox' | 'settings';

const TABS: { value: NotificationsTab; label: string }[] = [
  { value: 'inbox', label: '받은 알림' },
  { value: 'settings', label: '알림 설정' },
];

interface SegmentTabsProps {
  value: NotificationsTab;
  onChange: (tab: NotificationsTab) => void;
}

// 받은 알림 | 알림 설정 전환 (R17)
export function SegmentTabs({ value, onChange }: SegmentTabsProps) {
  return (
    <div role="tablist" className="grid grid-cols-2 rounded-pill bg-surface p-1 ring-1 ring-line">
      {TABS.map((tab) => {
        const isActive = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.value)}
            className={`h-8 rounded-pill text-sm ${isActive ? 'bg-ink font-semibold text-white' : 'text-muted'}`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
