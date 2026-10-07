import { Link, Outlet, useNavigate } from 'react-router-dom';

import type { Role } from '@/features/auth/api';
import { LoadingState } from '@/shared/ui/LoadingState';

import { StatusScreen } from './StatusScreen';
import { useAuth } from './useAuth';

interface RequireRoleProps {
  role: Exclude<Role, 'resident'>;
}

// 화면에서 막는 것은 편의일 뿐 보안이 아니다. 실제 권한은 RLS·RPC가 막는다 (컨벤션 10장)
// 역할이 다르면 조용히 홈으로 보내지 않고 C5 "볼 수 없는 화면이에요"를 보여 준다
export function RequireRole({ role }: RequireRoleProps) {
  const { role: myRole, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) return <LoadingState />;
  if (myRole === role) return <Outlet />;
  if (role === 'owner') {
    return (
      <StatusScreen
        title="사장님만 볼 수 있는 화면이에요"
        body="가게 등록이 승인되면 이 화면을 쓸 수 있어요."
        actions={[{ label: '주민 홈으로', onClick: () => navigate('/') }]}
        footer={
          <Link to="/owner/signup" className="mt-4 text-sm text-muted underline">
            우리 가게 등록하기
          </Link>
        }
      />
    );
  }
  return (
    <StatusScreen
      title="운영자만 볼 수 있는 화면이에요"
      body="운영자 권한이 필요하면 자치회 담당자에게 요청해주세요."
      actions={[{ label: '홈으로', onClick: () => navigate('/') }]}
    />
  );
}
