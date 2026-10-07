import { formatRemaining } from '@/shared/lib/time';

interface CouponTimerBoxProps {
  expiresAt: string;
  nowMs: number;
}

// 서버가 정한 만료 시각까지 남은 시간. 실제 만료 판단은 redeem_coupon이 다시 한다
export function CouponTimerBox({ expiresAt, nowMs }: CouponTimerBoxProps) {
  const remainingMs = new Date(expiresAt).getTime() - nowMs;

  return (
    <section className="mt-4 rounded-card bg-accent-soft px-5 py-4 text-center" role="timer">
      <p className="text-sm text-sub">쿠폰 남은 시간</p>
      <p className="my-1 text-[40px] leading-tight font-bold text-accent tabular-nums">
        {formatRemaining(remainingMs)}
      </p>
      <p className="text-xs text-sub">시간이 지나면 쿠폰이 자동으로 반환돼요</p>
    </section>
  );
}
