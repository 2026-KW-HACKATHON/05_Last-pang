interface PushToggleRowProps {
  isOn: boolean;
  onToggle: () => void;
}

// 알림 받기 스위치. 켜기는 알림 허용 화면으로, 끄기는 브라우저 설정 안내로 (웹은 권한을 직접 끌 수 없음)
export function PushToggleRow({ isOn, onToggle }: PushToggleRowProps) {
  return (
    <div className="flex h-14 items-center px-4">
      <span>알림 받기</span>
      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        aria-label="알림 받기"
        onClick={onToggle}
        className={`ml-auto flex h-7 w-12 items-center rounded-pill p-0.5 transition-colors ${isOn ? 'bg-accent' : 'bg-line'}`}
      >
        <span
          className={`size-6 rounded-full bg-surface shadow transition-transform ${isOn ? 'translate-x-5' : ''}`}
        />
      </button>
    </div>
  );
}
