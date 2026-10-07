import { Mascot } from '@/shared/ui/Mascot';

// R5 공통 머리: 마스코트 + 제목
export function OnboardingHero() {
  return (
    <div className="flex flex-col items-center text-center">
      <Mascot pose="phone" size={120} />
      <h1 className="mt-4 text-2xl leading-snug font-bold">
        딱 맞는 딜이 열리면
        <br />
        바로 알려드릴게요
      </h1>
    </div>
  );
}
