import { Link, useRouteError } from 'react-router-dom';

import { toAppError } from '@/shared/lib/errors';

// 라우터 errorElement: 한 화면의 렌더링 오류가 앱 전체를 하얗게 멈추지 않게 한다.
// 없는 주소(404)도 여기로 온다. 기술 메시지 대신 ERROR_MESSAGES 문구만 보여준다
export function RouteErrorPage() {
  const error = useRouteError();

  return (
    <main className="p-8 text-center">
      <p className="mb-4 text-muted">{toAppError(error).message}</p>
      <Link to="/" className="text-accent">
        처음으로
      </Link>
    </main>
  );
}
