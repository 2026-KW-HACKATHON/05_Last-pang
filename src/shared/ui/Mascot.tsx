import cheerUrl from '@/shared/assets/mascot/cheer.webp';
import heartUrl from '@/shared/assets/mascot/heart.webp';
import mapUrl from '@/shared/assets/mascot/map.webp';
import phoneUrl from '@/shared/assets/mascot/phone.webp';
import riceUrl from '@/shared/assets/mascot/rice.webp';
import waveUrl from '@/shared/assets/mascot/wave.webp';

// 원본 PNG(1254px, 약 1.2MB)는 assets/mascot에 두고, 화면에는 320px webp(약 12KB)만 싣는다
const MASCOT_URLS = {
  cheer: cheerUrl,
  heart: heartUrl,
  map: mapUrl,
  phone: phoneUrl,
  rice: riceUrl,
  wave: waveUrl,
} as const;

export type MascotPose = keyof typeof MASCOT_URLS;

interface MascotProps {
  pose: MascotPose;
  size?: number;
  className?: string;
}

export function Mascot({ pose, size = 120, className = '' }: MascotProps) {
  return (
    <img
      src={MASCOT_URLS[pose]}
      alt=""
      width={size}
      height={size}
      className={`select-none ${className}`}
      draggable={false}
    />
  );
}
