import { Link } from 'react-router-dom';

interface MyInfoFooterLinksProps {
  onSignOut: () => void;
}

// 내 정보 맨 아래 작은 링크 줄 (R12-1)
export function MyInfoFooterLinks({ onSignOut }: MyInfoFooterLinksProps) {
  return (
    <nav className="mt-5 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-xs text-faint">
      <Link to="/help">문의하기</Link>
      <span aria-hidden="true">·</span>
      <Link to="/terms/service">이용약관</Link>
      <span aria-hidden="true">·</span>
      <Link to="/terms/privacy">개인정보 처리방침</Link>
      <span aria-hidden="true">·</span>
      <button type="button" onClick={onSignOut}>
        로그아웃
      </button>
      <span aria-hidden="true">·</span>
      <Link to="/me/withdraw">회원 탈퇴</Link>
    </nav>
  );
}
