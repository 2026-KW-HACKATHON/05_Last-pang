import { Icon } from '../../components/Icon';
import { Card } from '../../components/ui/Card';

const STEPS = [
  { title: "'첫 코드 발급' 버튼 터치", body: '별도 서류나 인증 없이 바로 생성돼요' },
  { title: '화면에 뜨는 6자리 숫자 확인', body: '우리 매장만의 전용 승인 번호예요' },
  { title: '카운터나 포스기에 메모해 두기', body: '손님이 방문 결제 시 직접 보여주거나 입력해요' },
] as const;

/** O6 미발급 — 아직 가게 코드가 없어요 */
export function CodeNotIssued() {
  return (
    <div className="space-y-4">
      <Card className="relative overflow-hidden text-center">
        <span className="mx-auto flex size-20 items-center justify-center rounded-pill bg-surface text-accent shadow-[0_4px_16px_rgb(0_0_0/0.08)]">
          <Icon name="store" size={36} />
        </span>
        <p className="mt-4 text-lg font-bold">아직 가게 코드가 없어요</p>
        <p className="mt-1 text-[13px] leading-5 text-muted">
          손님이 가게에서 타임세일 쿠폰을 쓸 때
          <br />
          확인할 6자리 고유 코드가 필요해요.
        </p>
        <p className="mt-3 inline-flex items-center gap-1 rounded-pill bg-gray px-3 py-1 text-xs">
          <Icon name="bolt" size={12} className="text-accent" /> 3초 만에 발급받고 매장에 비치해
          보세요!
        </p>
      </Card>
      <Card>
        <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold">
          <Icon name="info" size={16} /> 어떻게 사용하나요?
        </p>
        <ol className="space-y-2">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-3 rounded-field bg-gray p-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-pill bg-accent text-xs font-bold text-white">
                {index + 1}
              </span>
              <span>
                <span className="block text-sm font-semibold">{step.title}</span>
                <span className="block text-xs text-muted">{step.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
