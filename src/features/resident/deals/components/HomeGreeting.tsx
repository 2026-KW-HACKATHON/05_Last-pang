import { Icon } from '@/shared/ui/Icon';

interface HomeGreetingProps {
  nickname: string | null;
  onSettingsClick: () => void;
}

export function HomeGreeting({ nickname, onSettingsClick }: HomeGreetingProps) {
  return (
    <div className="mb-3 flex items-center justify-between text-sm text-sub">
      <p>
        {nickname ?? '이웃'}님, 지금 갈 수 있는 딜이에요
        <span className="ml-1 inline-block size-1.5 rounded-full bg-accent align-middle" />
      </p>
      <button
        type="button"
        onClick={onSettingsClick}
        aria-label="보기 설정"
        className="flex size-9 items-center justify-center rounded-full bg-cream"
      >
        <Icon name="sliders" size={18} />
      </button>
    </div>
  );
}
