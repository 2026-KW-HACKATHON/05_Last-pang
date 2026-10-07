interface OverlapNoticeProps {
  message: string;
  description?: string;
}

// 시간 겹침·저장 실패 안내 (R13 바텀시트2)
export function OverlapNotice({ message, description }: OverlapNoticeProps) {
  return (
    <div
      role="alert"
      className="flex gap-2 rounded-[12px] bg-accent-tint px-4 py-3 ring-1 ring-accent-disabled"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="mt-0.5 shrink-0 text-danger"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7.5v5.5M12 16.2v.3" />
      </svg>
      <div>
        <p className="text-sm font-bold text-danger">{message}</p>
        {description && <p className="mt-1 text-xs leading-relaxed text-muted">{description}</p>}
      </div>
    </div>
  );
}
