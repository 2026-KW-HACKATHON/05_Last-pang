import { MenuRow } from './MenuRow';

interface OwnerMenuRowProps {
  isOwner: boolean;
}

// 승인된 사장님이면 사장님 화면으로 전환, 아니면 가게 등록 안내 (R12 / R12-1)
export function OwnerMenuRow({ isOwner }: OwnerMenuRowProps) {
  if (isOwner) {
    return (
      <MenuRow
        to="/owner"
        label="사장님 화면으로 가기"
        icon="swap"
        badge={
          <span className="rounded-md bg-success-tint px-1.5 py-0.5 text-xs font-semibold text-success">
            승인됨
          </span>
        }
      />
    );
  }
  return (
    <MenuRow
      to="/owner/signup"
      label="우리 가게 등록하기"
      badge={
        <span className="rounded-pill bg-accent-tint px-2 py-0.5 text-xs font-bold text-accent">
          사장님
        </span>
      }
    />
  );
}
