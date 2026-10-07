// O6-1 카운터 안내문 인쇄 — 보안을 위해 가게 코드는 안내문에 넣지 않는다
import { Mascot } from '@/shared/ui/Mascot';

import { Icon } from '../../components/Icon';
import { Button } from '../../components/ui/Button';
import { NoticeBox } from '../../components/ui/NoticeBox';
import { StickyBar } from '../../components/ui/StickyBar';
import { TopBar } from '../../components/ui/TopBar';

const STEPS = [
  '앱에서 받은 쿠폰을 열어요',
  '사장님께 가게 코드를 물어봐요',
  '코드 6자리를 입력하면 사용 완료!',
] as const;

export function PrintGuidePage() {
  return (
    <div className="mx-auto min-h-dvh max-w-[480px] pb-28">
      <TopBar title="안내문 인쇄" />
      <div className="space-y-4 px-5 pt-5">
        <article className="print-area aspect-[210/297] rounded-card border border-line bg-surface p-6 text-center shadow-[0_8px_24px_rgb(0_0_0/0.06)]">
          <p className="text-2xl font-extrabold text-accent">동네냠냠</p>
          <h2 className="mt-4 text-xl leading-8 font-bold">
            이 가게는
            <br />
            동네냠냠 타임딜 가게예요
          </h2>
          <Mascot pose="heart" size={110} className="mx-auto my-4" />
          <ol className="space-y-2 text-left">
            {STEPS.map((step, index) => (
              <li key={step} className="flex items-center gap-3 rounded-field bg-gray p-3 text-sm">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-pill bg-accent text-xs font-bold text-white">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs text-muted">가게 코드는 사장님께 물어봐 주세요</p>
        </article>
        <NoticeBox tone="tint" icon="shield">
          보안을 위해 가게 코드는 안내문에 넣지 않아요
        </NoticeBox>
      </div>
      <StickyBar>
        <Button block onClick={() => window.print()}>
          <Icon name="printer" size={18} /> 인쇄하기
        </Button>
      </StickyBar>
    </div>
  );
}
