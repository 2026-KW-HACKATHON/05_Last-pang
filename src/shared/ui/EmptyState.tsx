import { Mascot, type MascotPose } from './Mascot';

import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  pose?: MascotPose;
  action?: ReactNode; // 다음 행동 (예: 반경 넓히기 링크) — 빈 화면에서 끝나지 않게
}

export function EmptyState({ title, description, pose = 'wave', action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-8 py-12 text-center">
      <Mascot pose={pose} size={112} />
      <p className="mt-4 text-lg font-bold">{title}</p>
      {description && <p className="mt-2 text-sm text-sub">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
