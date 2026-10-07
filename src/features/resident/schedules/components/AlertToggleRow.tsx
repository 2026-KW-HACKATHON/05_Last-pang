interface AlertToggleRowProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

// 알림 슬롯 한 줄 + 켜고 끄는 스위치 (R13-5)
export function AlertToggleRow({ title, description, checked, onChange }: AlertToggleRowProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 px-4 py-4">
      <span>
        <span className="block font-bold">{title}</span>
        <span className="mt-0.5 block text-xs text-muted">{description}</span>
      </span>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={`relative h-7 w-12 shrink-0 rounded-pill transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 ${
          checked ? 'bg-accent' : 'bg-line'
        }`}
      >
        <span
          className={`absolute top-1 size-5 rounded-full bg-surface shadow transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </span>
    </label>
  );
}
