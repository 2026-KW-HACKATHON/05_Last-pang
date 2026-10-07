import { Icon, type IconName } from '../Icon';

interface IconButtonProps {
  icon: IconName;
  label: string;
  onClick: () => void;
  /** 안 읽은 것이 있으면 크림슨 점 */
  hasDot?: boolean;
  filled?: boolean;
}

export function IconButton({
  icon,
  label,
  onClick,
  hasDot = false,
  filled = false,
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`relative flex size-10 items-center justify-center rounded-pill text-ink ${filled ? 'bg-gray' : ''}`}
    >
      <Icon name={icon} size={22} />
      {hasDot && <span className="absolute top-2 right-2 size-2 rounded-pill bg-accent" />}
    </button>
  );
}
