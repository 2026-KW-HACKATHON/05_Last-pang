import { Mascot, type MascotPose } from './Mascot';

import type { ReactNode } from 'react';

interface StatusBlockProps {
  pose: MascotPose;
  title: string;
  body?: ReactNode;
  action?: ReactNode;
  badge?: ReactNode;
}

/** 마스코트 + 제목 + 설명 + 행동 (완료·승인 대기·없는 가게 화면) */
export function StatusBlock({ pose, title, body, action, badge }: StatusBlockProps) {
  return (
    <div className="flex flex-col items-center px-5 py-8 text-center">
      <Mascot pose={pose} />
      {badge && <div className="mt-4">{badge}</div>}
      <h2 className="mt-3 text-[22px] leading-[30px] font-bold whitespace-pre-line">{title}</h2>
      {body && (
        <div className="mt-2 text-[15px] leading-[22px] whitespace-pre-line text-muted">{body}</div>
      )}
      {action && <div className="mt-6 w-full">{action}</div>}
    </div>
  );
}
