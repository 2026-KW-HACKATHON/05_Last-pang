import { Link } from 'react-router-dom';

import { Mascot } from '@/shared/ui/Mascot';

// 없는 딜 (피그마 C4 페이지를 찾을 수 없어요 - 없는 딜)
export function DealNotFound() {
  return (
    <div className="flex flex-col items-center px-8 pt-[22dvh] text-center">
      <Mascot pose="rice" size={140} />
      <p className="mt-5 text-lg font-bold">딜을 찾을 수 없어요</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        사장님이 딜을 내렸거나 주소가 잘못됐어요.
        <br />
        근처의 다른 딜을 확인해 보세요.
      </p>
      <Link
        to="/"
        replace
        className="mt-6 flex h-[52px] w-full items-center justify-center rounded-[12px] bg-accent font-semibold text-white"
      >
        다른 딜 보러 가기
      </Link>
    </div>
  );
}
