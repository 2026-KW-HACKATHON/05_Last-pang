import { useNavigate } from 'react-router-dom';

import { Mascot } from '@/shared/ui/Mascot';

import type { ReactNode } from 'react';

interface StatusScreenProps {
  title: string;
  body: ReactNode;
  mascot?: 'map' | 'rice';
  actions: Array<{ label: string; onClick: () => void; isPrimary?: boolean }>;
  footer?: ReactNode;
}

/** 공통 C4 · C5 · C6 상태 화면 (마스코트 + 제목 + 설명 + 버튼) */
export function StatusScreen({ title, body, mascot = 'map', actions, footer }: StatusScreenProps) {
  const navigate = useNavigate();
  return (
    <main className="mx-auto flex min-h-dvh max-w-[480px] flex-col">
      <header className="flex h-14 items-center bg-gray px-2">
        <button
          type="button"
          aria-label="뒤로"
          onClick={() => navigate(-1)}
          className="flex size-11 items-center justify-center text-xl"
        >
          ‹
        </button>
      </header>
      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-16 text-center">
        <Mascot pose={mascot} size={120} />
        <h1 className="mt-5 text-[22px] font-bold">{title}</h1>
        <div className="mt-2 text-[15px] leading-[22px] whitespace-pre-line text-muted">{body}</div>
        <div className="mt-8 w-full space-y-2">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              className={`h-[52px] w-full rounded-button font-semibold ${action.isPrimary === false ? 'bg-gray text-ink' : 'bg-accent text-white'}`}
            >
              {action.label}
            </button>
          ))}
        </div>
        {footer}
      </div>
    </main>
  );
}
