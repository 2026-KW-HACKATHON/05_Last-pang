import { Link } from 'react-router-dom';

import { BottomBar } from '@/shared/ui/BottomBar';
import { Icon } from '@/shared/ui/Icon';

import type { MyDealCoupon } from '../types';

interface CouponLinkBarProps {
  coupon: MyDealCoupon;
  isJustClaimed: boolean; // 방금 받은 쿠폰이면 "내 쿠폰함 바로가기" (피그마 R7 발급 완료)
}

const LINK_CLASS =
  'flex h-[52px] items-center justify-center gap-1.5 rounded-[12px] bg-accent font-semibold text-white';

// 이미 받은(또는 사용한) 쿠폰이 있을 때의 하단 버튼 (피그마 R7 기발급 · 발급 완료)
export function CouponLinkBar({ coupon, isJustClaimed }: CouponLinkBarProps) {
  if (coupon.status === 'used') {
    return (
      <BottomBar>
        <Link to={`/coupons/${coupon.id}`} className={LINK_CLASS}>
          사용 내역 보기
          <Icon name="chevronRight" size={18} />
        </Link>
      </BottomBar>
    );
  }
  if (isJustClaimed) {
    return (
      <BottomBar>
        <p className="mb-2 flex items-center justify-center gap-1 text-xs text-muted">
          <Icon name="checkCircle" size={14} className="text-accent" />
          보관함에 안전하게 저장되었습니다
        </p>
        <Link to={`/coupons/${coupon.id}`} className={LINK_CLASS}>
          내 쿠폰함 바로가기 →
        </Link>
      </BottomBar>
    );
  }
  return (
    <BottomBar>
      <Link to={`/coupons/${coupon.id}`} className={LINK_CLASS}>
        <Icon name="ticket" size={20} />내 쿠폰에서 사용하기
      </Link>
    </BottomBar>
  );
}
