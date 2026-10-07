import { Icon } from '../../components/Icon';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { NoticeBox } from '../../components/ui/NoticeBox';

/** O6 기본(발급됨) — 코드는 다시 보여 주지 않는다 */
export function CodeIssuedInfo() {
  return (
    <div className="space-y-4">
      <div className="mx-auto w-48 rounded-card border border-line bg-surface p-4 text-center shadow-[0_8px_24px_rgb(0_0_0/0.06)]">
        <p className="text-[11px] font-semibold text-muted">STAND NO.1 ●</p>
        <Icon name="qr" size={56} className="mx-auto my-2 text-ink" />
        <p className="text-[11px] text-muted">STORE CODE</p>
        <p className="text-xl font-bold tracking-[6px]">●●●●●●</p>
      </div>
      <div className="text-center">
        <h2 className="text-xl font-bold">
          손님이 쿠폰을 쓸 때
          <br />이 코드를 알려주세요
        </h2>
        <p className="mt-1 text-[13px] text-muted">
          손님이 화면에서 6자리 코드를 입력하면 쿠폰 사용 처리가 즉시 완료돼요.
        </p>
      </div>
      <Card tone="gray" className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">보안 상태</span>
          <span>암호화(Hash)로 안전하게 보호 중</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">코드 유효 상태</span>
          <Badge tone="success" withDot>
            정상 작동 중
          </Badge>
        </div>
      </Card>
      <NoticeBox tone="danger" title="카운터나 포스기에 미리 적어두세요">
        코드는 발급할 때 딱 한 번만 보여드려요. 손님이 결제할 때 바로 볼 수 있도록 잘 보이는 위치에
        비치해 주세요.
      </NoticeBox>
    </div>
  );
}
