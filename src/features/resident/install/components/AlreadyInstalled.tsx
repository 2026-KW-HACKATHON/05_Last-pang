import { Link } from 'react-router-dom';

import { Icon } from '@/shared/ui/Icon';

// R16 이미 설치함: 홈 화면 앱으로 열려 있을 때
export function AlreadyInstalled() {
  return (
    <div className="flex flex-col items-center px-8 pt-[30vh] text-center">
      <span className="flex size-19 items-center justify-center rounded-full bg-accent-tint text-accent">
        <Icon name="checkCircle" size={32} />
      </span>
      <h2 className="mt-6 text-lg font-bold">이미 홈 화면에 있어요</h2>
      <p className="mt-2 text-sm text-faint">
        홈 화면의 동네냠냠으로 열면
        <br />
        알림도 바로 받을 수 있어요.
      </p>
      <Link
        to="/me"
        className="mt-8 flex h-[52px] w-full items-center justify-center rounded-[12px] bg-accent font-semibold text-white"
      >
        내 정보로
      </Link>
    </div>
  );
}
