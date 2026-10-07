import type { Platform } from '../platform';

const TABS: { value: Platform; label: string }[] = [
  { value: 'ios', label: 'iPhone' },
  { value: 'android', label: 'Android' },
];

interface PlatformTabsProps {
  value: Platform;
  onChange: (value: Platform) => void;
}

// iPhone | Android 세그먼트 (R16)
export function PlatformTabs({ value, onChange }: PlatformTabsProps) {
  return (
    <div role="tablist" className="grid grid-cols-2 gap-1 rounded-[12px] bg-gray p-1">
      {TABS.map((tab) => {
        const isActive = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.value)}
            className={`h-9 rounded-[10px] text-sm ${isActive ? 'bg-surface font-bold text-accent shadow-sm' : 'text-muted'}`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
