import { BottomBar } from '@/shared/ui/BottomBar';
import { Mascot } from '@/shared/ui/Mascot';

interface PushDeniedViewProps {
  onFinish: () => void;
}

// 브라우저 팝업에서 차단했을 때 (R5-1 브라우저 팝업에서 차단함)
export function PushDeniedView({ onFinish }: PushDeniedViewProps) {
  return (
    <div className="px-5 pt-8 text-center">
      <Mascot pose="phone" size={120} className="mx-auto block" />
      <h1 className="mt-4 text-2xl font-bold">알림을 받지 않기로 했어요</h1>
      <p className="mt-3 text-sm text-muted">괜찮아요. 딜은 홈과 알림함에서 언제든 볼 수 있어요.</p>
      <section className="mt-6 rounded-card bg-gray p-4 text-left">
        <h2 className="text-sm font-bold">나중에 켜려면</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          알림함 › 알림 설정에서 켜거나, 브라우저 설정에서 동네냠냠 알림을 허용해 주세요.
        </p>
      </section>
      <BottomBar>
        <button
          type="button"
          onClick={onFinish}
          className="h-[52px] w-full rounded-[12px] bg-accent font-semibold text-white"
        >
          동네 딜 보러 가기
        </button>
      </BottomBar>
    </div>
  );
}
