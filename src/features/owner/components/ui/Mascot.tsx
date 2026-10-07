import { cx } from '../../lib/styles';

export type MascotPose = 'wave' | 'eat' | 'map' | 'heart';

interface MascotProps {
  pose: MascotPose;
  size?: number;
  className?: string;
}

export function Mascot({ pose, size = 120, className }: MascotProps) {
  return (
    <img
      src={`/brand/mascot-${pose}.webp`}
      alt=""
      width={size}
      height={size}
      className={cx('mx-auto select-none', className)}
      draggable={false}
    />
  );
}
