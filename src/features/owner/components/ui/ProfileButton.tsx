import { useNavigate } from 'react-router-dom';

import { Icon } from '../Icon';

/** 오른쪽 위 크림슨 동그라미 사람 아이콘 → 내 정보 */
export function ProfileButton({ to }: { to: string }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      aria-label="내 정보"
      onClick={() => navigate(to)}
      className="flex size-9 items-center justify-center rounded-pill bg-accent text-white"
    >
      <Icon name="user" size={18} />
    </button>
  );
}
