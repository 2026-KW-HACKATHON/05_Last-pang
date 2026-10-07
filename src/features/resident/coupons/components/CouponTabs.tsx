interface CouponTabsProps {
  isPastTab: boolean;
  availableCount: number;
  onChange: (isPastTab: boolean) => void;
}

// 사용 가능 / 지난 쿠폰 전환 (피그마 R11)
export function CouponTabs({ isPastTab, availableCount, onChange }: CouponTabsProps) {
  const tabs = [
    { isPast: false, label: `사용 가능 ${availableCount}` },
    { isPast: true, label: '지난 쿠폰' },
  ];

  return (
    <div className="grid grid-cols-2 rounded-pill bg-surface p-1 ring-1 ring-line" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.label}
          type="button"
          role="tab"
          aria-selected={tab.isPast === isPastTab}
          onClick={() => onChange(tab.isPast)}
          className={`h-9 rounded-pill text-sm ${tab.isPast === isPastTab ? 'bg-ink font-bold text-white' : 'text-sub'}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
