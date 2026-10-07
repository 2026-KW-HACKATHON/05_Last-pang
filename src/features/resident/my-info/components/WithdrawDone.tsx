import { Mascot } from '@/shared/ui/Mascot';

interface WithdrawDoneProps {
  onHome: () => void;
}

// R14 탈퇴 완료
export function WithdrawDone({ onHome }: WithdrawDoneProps) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-[480px] flex-col items-center justify-center bg-surface px-8 text-center">
      <Mascot pose="wave" size={140} />
      <h1 className="mt-6 text-lg font-bold">탈퇴가 끝났어요</h1>
      <p className="mt-2 text-sm text-muted">
        그동안 동네냠냠을 이용해 주셔서 고마워요.
        <br />
        언제든 다시 찾아와 주세요.
      </p>
      <button
        type="button"
        onClick={onHome}
        className="mt-8 h-[52px] w-full rounded-[12px] bg-accent font-semibold text-white"
      >
        처음으로
      </button>
    </main>
  );
}
