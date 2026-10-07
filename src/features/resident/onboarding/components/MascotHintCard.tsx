import { Mascot } from '@/shared/ui/Mascot';

// 닉네임이 비었을 때 위에 보이는 마스코트 안내 (피그마 R3 미입력)
export function MascotHintCard() {
  return (
    <div className="mt-6 flex items-center gap-3 rounded-card p-4 ring-1 ring-line">
      <Mascot pose="heart" size={52} />
      <div className="text-sm">
        <p className="font-semibold text-accent">월계 1동 동네 마스코트 냥이</p>
        <p className="mt-0.5">정다운 우리 동네에서 쓰실 닉네임을 지어봐요!</p>
      </div>
    </div>
  );
}
