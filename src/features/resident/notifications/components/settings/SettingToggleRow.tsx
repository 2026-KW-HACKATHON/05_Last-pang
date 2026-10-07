interface SettingToggleRowProps {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

// 설정 한 줄 + 스위치. disabled면 꺼진 모양으로 흐리게
export function SettingToggleRow({
  title,
  description,
  checked,
  disabled = false,
  onChange,
}: SettingToggleRowProps) {
  const isOn = checked && !disabled;
  return (
    <label
      className={`flex items-center justify-between gap-3 px-5 py-3.5 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span>
        <span className="block">{title}</span>
        <span className="mt-0.5 block text-xs text-faint">{description}</span>
      </span>
      <input
        type="checkbox"
        role="switch"
        checked={isOn}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={`relative h-7 w-12 shrink-0 rounded-pill transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 ${
          isOn ? 'bg-accent' : 'bg-gray ring-1 ring-line'
        }`}
      >
        <span
          className={`absolute top-1 size-5 rounded-full bg-surface shadow transition-transform ${
            isOn ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </span>
    </label>
  );
}
