import { Link, useNavigate } from 'react-router-dom';

import { signOut } from '@/features/auth/api';
import { Icon } from '@/features/owner/components/Icon';
import { useMyProfile } from '@/features/resident/profile/hooks';
import { POLICY } from '@/shared/constants/policy';

interface CouncilHeaderProps {
  months: string[];
  month: string;
  onMonthChange: (month: string) => void;
}

const monthLabel = (value: string) => `${value.slice(0, 4)}년 ${Number(value.slice(5, 7))}월`;

/** A5 상단 바: 로고 · 자치회 · 리포트/가게 승인·신고 탭 · 달 고르기 · 담당자 · 로그아웃 */
export function CouncilHeader({ months, month, onMonthChange }: CouncilHeaderProps) {
  const navigate = useNavigate();
  const profile = useMyProfile();
  const handleSignOut = () => void signOut().then(() => navigate('/login', { replace: true }));

  return (
    <header className="flex h-[68px] print:hidden items-center justify-between border-b border-line bg-surface px-10">
      <nav className="flex h-full items-center gap-7">
        <span className="text-[22px] font-bold text-accent">동네냠냠</span>
        <span className="rounded-pill bg-busy px-2 py-0.5 text-[11px] text-muted">자치회</span>
        <span className="flex h-full items-center border-b-2 border-accent pt-0.5 text-[15px] font-bold text-accent">
          리포트
        </span>
        <Link to="/admin/stores" className="text-[15px] text-muted hover:text-ink">
          가게 승인·신고
        </Link>
      </nav>
      <div className="flex items-center gap-7">
        <label className="relative flex h-10 w-[180px] items-center rounded-field border border-line bg-surface pr-4 pl-4 text-sm">
          <Icon name="calendar" size={14} className="pointer-events-none mr-2.5 shrink-0" />
          <select
            aria-label="리포트 달"
            value={month}
            onChange={(event) => onMonthChange(event.target.value)}
            className="w-full appearance-none bg-transparent outline-none"
          >
            {months.map((value) => (
              <option key={value} value={value}>
                {monthLabel(value)}
              </option>
            ))}
          </select>
          <Icon
            name="chevron"
            size={14}
            className="pointer-events-none absolute right-4 rotate-90 text-muted"
          />
        </label>
        <span className="text-[13px] text-muted">
          {POLICY.neighborhoodName} 주민자치회
          {profile.data?.nickname ? ` · ${profile.data.nickname}` : ''}
        </span>
        <button
          type="button"
          onClick={handleSignOut}
          className="text-[13px] text-muted hover:text-ink"
        >
          로그아웃
        </button>
      </div>
    </header>
  );
}
