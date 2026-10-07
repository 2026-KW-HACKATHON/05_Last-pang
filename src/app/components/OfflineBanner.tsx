import { useIsOnline } from '@/shared/hooks/useIsOnline';
import { Icon } from '@/shared/ui/Icon';

// C7 오프라인 띠: 조회 화면은 마지막으로 받은 내용을 그대로 보여 주고, 위에 상태만 알린다
// 쓰기 버튼(쿠폰 받기·사용)은 각 화면이 useIsOnline으로 막는다
export function OfflineBanner() {
  const isOnline = useIsOnline();
  if (isOnline) return null;
  return (
    <div
      role="status"
      className="fixed inset-x-0 top-[64px] z-40 mx-auto flex w-[calc(100%-40px)] max-w-[440px] items-center gap-2 rounded-[12px] bg-ink px-4 py-2.5 text-sm text-white shadow-lg"
    >
      <Icon name="wifiOff" size={18} />
      <span className="flex-1">인터넷에 연결되어 있지 않아요</span>
      <span className="text-xs text-white/60">마지막 상태</span>
    </div>
  );
}
