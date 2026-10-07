import type { ReactNode } from 'react';

interface FieldProps {
  label: string;
  hint?: ReactNode;
  error?: string;
  /** 오른쪽 위 (8/30, 형식 확인, 운영자 확인용 …) */
  aside?: ReactNode;
  children: ReactNode;
}

export function Field({ label, hint, error, aside, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[15px] font-semibold">{label}</span>
        {aside && <span className="text-[13px] text-faint">{aside}</span>}
      </div>
      {children}
      {error ? (
        <p className="flex items-center gap-1 text-[13px] text-danger" role="alert">
          ⓘ {error}
        </p>
      ) : (
        hint && <p className="text-[13px] text-faint">{hint}</p>
      )}
    </div>
  );
}
