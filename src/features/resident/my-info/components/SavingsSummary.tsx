import { formatPrice } from '@/shared/lib/format';

interface SavingsSummaryProps {
  usedCount: number;
  savedPrice: number;
}

// 사용한 쿠폰 수와 아낀 금액(정가 - 딜 가격의 합)
export function SavingsSummary({ usedCount, savedPrice }: SavingsSummaryProps) {
  return (
    <section className="mt-4 grid grid-cols-2 rounded-card py-4 text-center ring-1 ring-line">
      <div>
        <p className="text-sm text-muted">사용한 쿠폰</p>
        <p className="mt-1 text-xl font-bold">{usedCount}개</p>
      </div>
      <div>
        <p className="text-sm text-muted">아낀 금액</p>
        <p className="mt-1 text-xl font-bold text-accent">{formatPrice(savedPrice)}</p>
      </div>
    </section>
  );
}
