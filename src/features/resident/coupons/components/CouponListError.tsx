import { Icon } from '@/shared/ui/Icon';

interface CouponListErrorProps {
  onRetry: () => void;
}

// 목록 불러오기 실패 (C9). 카드 안에 아이콘 · 문구 · 다시 시도
export function CouponListError({ onRetry }: CouponListErrorProps) {
  return (
    <div className="px-5 pt-5">
      <section
        className="flex flex-col items-center rounded-card px-6 py-10 text-center ring-1 ring-line"
        role="alert"
      >
        <span className="flex size-14 items-center justify-center rounded-full bg-gray text-muted">
          <Icon name="wifiOff" size={26} />
        </span>
        <p className="mt-4 font-bold">쿠폰을 불러오지 못했어요</p>
        <p className="mt-1.5 text-sm text-muted">인터넷 연결을 확인하고 다시 시도해 주세요.</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 flex items-center gap-1.5 rounded-[12px] bg-gray px-5 py-2.5 text-sm font-semibold"
        >
          <Icon name="refresh" size={16} />
          다시 시도
        </button>
      </section>
    </div>
  );
}
