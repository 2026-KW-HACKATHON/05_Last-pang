import { useNavigate } from 'react-router-dom';

import { IconButton } from '@/features/owner/components/ui/IconButton';
import { ProfileButton } from '@/features/owner/components/ui/ProfileButton';
import { RootHeader } from '@/features/owner/components/ui/RootHeader';

import { AdminTabBar } from './AdminTabBar';

import type { ReactNode } from 'react';

interface AdminShellProps {
  title: string;
  children: ReactNode;
  /** 제목 줄 오른쪽에 더 둘 것 (가게 추가 버튼 등) */
  action?: ReactNode;
}

/** 운영자 탭 화면 틀: 제목 + 회색 "운영자" 알약 + 종·프로필, 아래 탭 바 */
export function AdminShell({ title, children, action }: AdminShellProps) {
  const navigate = useNavigate();
  return (
    <div className="mx-auto min-h-dvh max-w-[480px] pb-28">
      <RootHeader
        title={title}
        roleLabel="운영자"
        right={
          <>
            {action}
            <IconButton icon="bell" label="신고·이슈" onClick={() => navigate('/admin/reports')} />
            <ProfileButton to="/admin/settings" />
          </>
        }
      />
      {children}
      <AdminTabBar />
    </div>
  );
}
