// O4-2 주민에게 보이는 화면 미리보기 — 주민 딜 상세(R7)와 같은 구조, 쿠폰은 받을 수 없다
import { useNavigate, useParams } from 'react-router-dom';

import { formatPrice } from '@/shared/lib/format';
import { distanceMeters, walkingMinutes, WOLGYE1_CENTER } from '@/shared/lib/geo';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';

import { Icon } from '../../components/Icon';
import { Button } from '../../components/ui/Button';
import { InfoRow } from '../../components/ui/InfoRow';
import { StickyBar } from '../../components/ui/StickyBar';
import { TopBar } from '../../components/ui/TopBar';
import { formatTimeRange } from '../../lib/format';
import { useOwnerDeal } from '../../history/hooks';
import { useMyStore } from '../../store/hooks';
import { calcDiscount } from '../schema';

export function DealPreviewPage() {
  const { dealId = '' } = useParams();
  const navigate = useNavigate();
  const deal = useOwnerDeal(dealId);
  const store = useMyStore();

  if (deal.isPending || store.isPending) return <LoadingState />;
  if (deal.isError) return <ErrorState error={deal.error} onRetry={() => void deal.refetch()} />;
  if (!deal.data || !store.data) return <ErrorState error={new Error('없는 딜')} />;

  const item = deal.data;
  const discount = calcDiscount(item.originalPrice, item.dealPrice);
  // 미리보기 거리: 월계1동 중심에서 가게까지 (실제 주민 화면은 주민 위치 기준)
  const meters = Math.round(
    distanceMeters(WOLGYE1_CENTER.lat, WOLGYE1_CENTER.lng, store.data.lat, store.data.lng),
  );
  return (
    <div className="mx-auto min-h-dvh max-w-[480px] pb-36">
      <div className="flex items-center justify-between bg-accent px-4 py-2.5 text-sm text-white">
        <span className="flex items-center gap-1.5">
          <Icon name="smartphone" size={16} /> 미리보기 · 주민에게 이렇게 보여요
        </span>
        <button type="button" aria-label="미리보기 닫기" onClick={() => navigate(-1)}>
          <Icon name="x" size={18} />
        </button>
      </div>
      <TopBar title="딜 상세" hideBack />
      <div className="space-y-5 px-5 pt-5">
        <div>
          <p className="text-sm text-muted">
            {store.data.name} · 도보 {walkingMinutes(meters)}분 ({meters}m)
          </p>
          <h1 className="mt-1 text-[22px] font-bold">{item.title}</h1>
          <p className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-accent">{formatPrice(item.dealPrice)}</span>
            <span className="text-faint line-through">{formatPrice(item.originalPrice)}</span>
            <span className="font-semibold text-accent">{discount.percent}% 할인</span>
          </p>
        </div>
        <div className="flex items-center justify-between rounded-field bg-gray p-4">
          <span className="text-sm text-muted">남은 수량</span>
          <span>
            <b className="text-xl">{item.remainingQty}</b> / {item.totalQty}개
          </span>
        </div>
        <div>
          <InfoRow
            label="진행 시간"
            value={`오늘 ${formatTimeRange(item.startsAt, item.endsAt)}`}
          />
          <InfoRow
            label="쿠폰 유효시간"
            value={<span className="text-accent">⏱ 받은 뒤 {item.couponTtlMin}분</span>}
          />
          <InfoRow label="가게 주소" value={store.data.address} />
        </div>
        <div className="rounded-field bg-gray p-4 text-[13px] leading-5 text-muted">
          <p className="mb-1 font-semibold text-ink">이용 안내</p>
          <p>· 쿠폰 발급 후 {item.couponTtlMin}분 이내에 매장에 방문해야 합니다.</p>
          <p>· 매장 사장님께 가게 코드 6자리를 받아 입력하면 사용 완료돼요.</p>
        </div>
      </div>
      <StickyBar>
        <Button block disabled className="bg-gray text-faint">
          미리보기에서는 쿠폰을 받을 수 없어요
        </Button>
        <Button variant="text" block onClick={() => navigate(-1)}>
          닫기
        </Button>
      </StickyBar>
    </div>
  );
}
