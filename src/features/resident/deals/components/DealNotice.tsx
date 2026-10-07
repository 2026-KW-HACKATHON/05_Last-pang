interface DealNoticeProps {
  couponTtlMin: number;
}

// 쿠폰 사용 방법 안내 (항상 표시)
export function DealNotice({ couponTtlMin }: DealNoticeProps) {
  return (
    <section className="mt-8 rounded-xl bg-gray p-4 text-sm">
      <h3 className="mb-2 font-semibold">이용 안내</h3>
      <ul className="list-outside list-disc space-y-1 pl-4 text-muted">
        <li>쿠폰을 받은 뒤 {couponTtlMin}분 안에 매장에 방문해 주세요.</li>
        <li>사장님께 가게 코드 6자리를 물어보고 내 쿠폰 화면에 입력하면 사용이 끝나요.</li>
        <li>시간이 지나면 쿠폰은 자동으로 반환되고, 딜이 남아 있으면 다시 받을 수 있어요.</li>
      </ul>
    </section>
  );
}
