import { Link } from 'react-router-dom';

import { BottomBar } from '@/shared/ui/BottomBar';

import type { CouponDisplayStatus } from '../types';

interface CouponActionsProps {
  status: CouponDisplayStatus;
  dealId: string;
}

const BUTTON = 'flex h-[52px] items-center justify-center rounded-[12px] font-semibold';
const PRIMARY = `${BUTTON} bg-accent text-white`;
const SECONDARY = `${BUTTON} mt-2 ring-1 ring-line`;

// 사용 완료(R9) · 만료(R10) · 소진(R8-2) 화면 하단 버튼
export function CouponActions({ status, dealId }: CouponActionsProps) {
  if (status === 'used') {
    return (
      <BottomBar>
        <Link to="/coupons?tab=past" className={PRIMARY}>
          내 쿠폰으로
        </Link>
      </BottomBar>
    );
  }
  if (status === 'expired') {
    return (
      <BottomBar>
        <Link to={`/deals/${dealId}`} className={PRIMARY}>
          딜 다시 보기
        </Link>
        <Link to="/" className={SECONDARY}>
          홈으로
        </Link>
      </BottomBar>
    );
  }
  if (status === 'soldOut') {
    return (
      <BottomBar>
        <Link to="/" className={PRIMARY}>
          근처 다른 딜 보기
        </Link>
        <Link to="/coupons" className={SECONDARY}>
          내 쿠폰으로
        </Link>
      </BottomBar>
    );
  }
  return null;
}
