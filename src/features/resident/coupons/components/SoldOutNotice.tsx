import { Icon } from '@/shared/ui/Icon';

// 코드를 입력하는 사이 수량이 다 떨어졌을 때 (R8-2 코드 입력 중 소진됨)
export function SoldOutNotice() {
  return (
    <div className="rounded-card bg-accent-tint px-4 py-3.5" role="alert">
      <p className="flex items-center gap-2 text-sm font-bold text-danger">
        <Icon name="ban" size={18} />
        방금 수량이 모두 소진됐어요
      </p>
      <p className="mt-1 pl-[26px] text-sm text-ink">
        코드는 맞지만 남은 수량이 없어 사용되지 않았어요.
      </p>
    </div>
  );
}
