import { Icon, type IconName } from '../Icon';

import type { ReactNode } from 'react';

interface EmptyCardProps {
  icon: IconName;
  title: string;
  body?: ReactNode;
  action?: ReactNode;
}

/** 목록이 비었을 때: 연분홍 원 아이콘 + 제목 + 설명 + 행동 (피그마 "확인할 신고가 없어요" 등) */
export function EmptyCard({ icon, title, body, action }: EmptyCardProps) {
  return (
    <div className="flex flex-col items-center rounded-card border border-line bg-surface px-5 py-10 text-center">
      <span className="flex size-14 items-center justify-center rounded-pill bg-accent-tint text-accent">
        <Icon name={icon} size={26} />
      </span>
      <p className="mt-4 text-base font-semibold">{title}</p>
      {body && (
        <p className="mt-1.5 text-sm leading-[21px] whitespace-pre-line text-muted">{body}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
