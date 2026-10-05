import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  action?: ReactNode; // 다음 행동 (예: 반경 넓히기 링크) — 빈 화면에서 끝나지 않게
}

export function EmptyState({ title, action }: EmptyStateProps) {
  return (
    <div className="p-8 text-center">
      <p className="mb-4 text-muted">{title}</p>
      {action}
    </div>
  );
}
