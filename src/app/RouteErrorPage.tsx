import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom';

import { StatusScreen } from './StatusScreen';

// 라우터 errorElement: 한 화면의 렌더링 오류가 앱 전체를 하얗게 멈추지 않게 한다.
// 없는 주소(404)는 C4, 그 밖은 C6 문구만 보여준다 (기술 메시지 노출 금지)
export function RouteErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;

  if (isNotFound) {
    return (
      <StatusScreen
        title="페이지를 찾을 수 없어요"
        body="주소가 바뀌었거나 없어진 페이지예요."
        actions={[{ label: '홈으로', onClick: () => navigate('/') }]}
      />
    );
  }
  return (
    <StatusScreen
      mascot="eat"
      title="문제가 생겼어요"
      body={'일시적인 오류예요. 다시 시도해도 안 되면\n앱을 닫았다가 다시 열어 주세요.'}
      actions={[
        { label: '다시 시도', onClick: () => window.location.reload() },
        { label: '홈으로', onClick: () => navigate('/'), isPrimary: false },
      ]}
    />
  );
}
