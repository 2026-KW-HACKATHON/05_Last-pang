import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';

import { AppError, toAppError } from '@/shared/lib/errors';

// 라우터 errorElement: 한 화면의 렌더링 오류가 앱 전체를 하얗게 멈추지 않게 한다.
// 없는 주소(404)는 "페이지를 찾을 수 없어요", 그 밖은 ERROR_MESSAGES 문구만 보여준다 (기술 메시지 노출 금지)
export function RouteErrorPage() {
  const error = useRouteError();
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;
  const appError = isNotFound ? new AppError('NOT_FOUND') : toAppError(error);

  return (
    <main className="p-8 text-center">
      <p className="mb-4 text-muted">{appError.message}</p>
      <Link to="/" className="text-accent">
        처음으로
      </Link>
    </main>
  );
}
