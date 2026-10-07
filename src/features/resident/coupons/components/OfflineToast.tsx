import { Icon } from '@/shared/ui/Icon';

// 연결이 끊겨 코드를 못 보냈을 때 아래쪽에 남는 안내 (R8-1)
export function OfflineToast() {
  return (
    <div
      role="status"
      className="fixed inset-x-0 bottom-6 z-40 mx-auto flex w-[calc(100%-40px)] max-w-[440px] items-center gap-3 rounded-pill bg-gray px-5 py-3.5"
    >
      <Icon name="wifiOff" size={20} className="text-faint" />
      <p className="flex-1 text-center text-sm text-muted">
        인터넷 연결을 확인하고 다시 시도해 주세요
      </p>
    </div>
  );
}
