import { Link } from 'react-router-dom';

interface ProfileCardProps {
  nickname: string;
  loginLabel: string;
}

export function ProfileCard({ nickname, loginLabel }: ProfileCardProps) {
  return (
    <section className="flex items-center gap-4 rounded-card p-4 ring-1 ring-line">
      <span className="flex size-14 items-center justify-center rounded-full bg-accent-tint text-xl font-bold text-accent">
        {nickname.slice(0, 1)}
      </span>
      <div className="flex-1">
        <p className="text-lg font-bold">{nickname}</p>
        <p className="text-sm text-muted">{loginLabel}</p>
      </div>
      <Link
        to="/onboarding/profile?mode=edit"
        className="rounded-pill px-3 py-1.5 text-sm ring-1 ring-line"
      >
        수정
      </Link>
    </section>
  );
}
