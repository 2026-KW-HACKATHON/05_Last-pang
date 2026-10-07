import { useEffect, useRef, useState } from 'react';

import { Mascot, type MascotPose } from '@/shared/ui/Mascot';

const SLIDES: { pose: MascotPose; eyebrow: string; title: string }[] = [
  { pose: 'wave', eyebrow: '여유로운 시간의 발견', title: '사장님이 정한 시간에\n딱 맞는 딜' },
  { pose: 'map', eyebrow: '우리 동네 골목 레이더', title: '내 생활패턴과\n도보 반경 맞춤 안내' },
  {
    pose: 'phone',
    eyebrow: '도착 후 원터치 사용',
    title: '가게에 도착해서 쿠폰만\n보여주면 즉시 혜택!',
  },
];
const AUTO_MS = 4000;

// R1 서비스 소개 3장. 옆으로 밀거나 점을 눌러 넘기고, 가만히 두면 4초마다 넘어간다
export function IntroCarousel() {
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((prev) => (prev + 1) % SLIDES.length), AUTO_MS);
    return () => window.clearInterval(timer);
  }, [index]);

  const slide = SLIDES[index] ?? SLIDES[0];
  const move = (delta: number) =>
    setIndex((prev) => (prev + delta + SLIDES.length) % SLIDES.length);

  return (
    <section
      className="rounded-card bg-accent-tint px-5 pt-6 pb-5 text-center shadow-sm"
      onPointerDown={(event) => {
        startX.current = event.clientX;
      }}
      onPointerUp={(event) => {
        if (startX.current === null) return;
        const dx = event.clientX - startX.current;
        startX.current = null;
        if (Math.abs(dx) > 40) move(dx < 0 ? 1 : -1);
      }}
      aria-roledescription="carousel"
    >
      <Mascot pose={slide.pose} size={150} className="mx-auto" />
      <p className="mt-4 text-sm font-semibold text-accent">{slide.eyebrow}</p>
      <h2 className="mt-1 text-[20px] leading-7 font-bold whitespace-pre-line">{slide.title}</h2>
      <div className="mt-5 flex justify-center gap-1.5">
        {SLIDES.map((item, i) => (
          <button
            key={item.eyebrow}
            type="button"
            aria-label={`${i + 1}번째 소개`}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-pill transition-all ${i === index ? 'w-6 bg-accent' : 'w-2 bg-line'}`}
          />
        ))}
      </div>
    </section>
  );
}
