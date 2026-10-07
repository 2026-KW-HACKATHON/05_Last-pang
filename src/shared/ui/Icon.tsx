// 아이콘 라이브러리를 들이지 않고 화면에 쓰는 선 아이콘만 직접 그린다 (24×24, stroke = currentColor)
const PATHS = {
  back: 'M15 5l-7 7 7 7',
  chevronDown: 'M6 9l6 6 6-6',
  chevronRight: 'M9 6l6 6-6 6',
  close: 'M6 6l12 12M18 6L6 18',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  pin: 'M12 21s-7-6.2-7-11.5a7 7 0 0114 0C19 14.8 12 21 12 21zM12 12.2a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  walk: 'M13 4.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM10 21l2-6 2.5 2.5V21M9 11l2.5-3 3 3 2.5 1M11.5 8L9 15',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4.5 20.5c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5',
  sliders: 'M4 7h9M17 7h3M4 17h3M11 17h9M15 5v4M9 15v4',
  sort: 'M8 5v14M5 8l3-3 3 3M16 19V5M13 16l3 3 3-3',
  home: 'M4 10.5L12 4l8 6.5V20h-5.5v-6h-5v6H4z',
  bell: 'M6 16.5V11a6 6 0 0112 0v5.5l1.5 1.5h-15zM10 20.5a2 2 0 004 0',
  ticket: 'M3.5 7.5h17v3a1.8 1.8 0 000 3v3h-17v-3a1.8 1.8 0 000-3zM9.5 7.5v2M9.5 11v2M9.5 14.5v2',
  share:
    'M18 8.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM6 14.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18 20.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM8.2 13.2l7.6 4.1M15.8 6.7l-7.6 4.1',
  clock: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 7.5V12l3 2',
  lock: 'M6 11h12v9.5H6zM8.5 11V8a3.5 3.5 0 017 0v3',
  bookmark: 'M7 4h10v16.5l-5-3.5-5 3.5z',
  refresh: 'M19.5 12a7.5 7.5 0 11-2.2-5.3M19.5 4.5v4h-4',
  backspace: 'M8.5 5.5H20v13H8.5L3 12zM11.5 9.5l5 5M16.5 9.5l-5 5',
  store:
    'M4 9.5L5.5 4.5h13L20 9.5M4 9.5h16v1a2.7 2.7 0 01-5.3 0 2.7 2.7 0 01-5.4 0A2.7 2.7 0 014 10.5zM5.5 13v7h13v-7',
  copy: 'M9 9h11v11H9zM5 15H4V4h11v1',
  info: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 11v5.5M12 7.8v.2',
  wifiOff:
    'M3 3l18 18M8.5 16.5a5 5 0 017 0M5 12.8a10 10 0 015.6-2.7M14.5 10.4A10 10 0 0119 12.8M2 9a15 15 0 015.3-3M11 5a15 15 0 0111 4M12 20h.01',
  compass: 'M12 21a9 9 0 100-18 9 9 0 000 18zM15.5 8.5l-2 5-5 2 2-5z',
  send: 'M21 3L10 14M21 3l-7 18-4-7-7-4z',
  plus: 'M12 5v14M5 12h14',
  shield: 'M12 3l7.5 3v5.5c0 4.5-3.2 8.2-7.5 9.5-4.3-1.3-7.5-5-7.5-9.5V6z',
  // 공통·주민 화면 추가 아이콘 (피그마 UI 최종)
  more: 'M12 5.5v.01M12 12v.01M12 18.5v.01',
  flag: 'M5 21V4.5M5 4.5h11l-2 4 2 4H5',
  link: 'M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1',
  download: 'M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19.5h14',
  plusSquare: 'M4.5 4.5h15v15h-15zM12 8.5v7M8.5 12h7',
  alertTriangle: 'M12 4l9 16H3zM12 10v4.5M12 17.3v.2',
  alertCircle: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 7.5V13M12 16.3v.2',
  checkCircle: 'M12 21a9 9 0 100-18 9 9 0 000 18zM8 12.3l2.7 2.7L16 9.5',
  bellOff: 'M3 3l18 18M8.3 5.2A6 6 0 0118 11v4M6 11v5.5l-1.5 1.5H17M10 20.5a2 2 0 004 0',
  moon: 'M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z',
  trash: 'M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10 11v5.5M14 11v5.5',
  edit: 'M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4',
  calendar: 'M4.5 6h15v14h-15zM4.5 10h15M8.5 3.5V7M15.5 3.5V7',
  mail: 'M3.5 6h17v12h-17zM3.5 6.5L12 13l8.5-6.5',
  logout: 'M14 4.5h5.5v15H14M10 8l-4 4 4 4M6 12h9.5',
  swap: 'M16.5 4l3.5 3.5-3.5 3.5M20 7.5H8M7.5 20L4 16.5 7.5 13M4 16.5h12',
  bulb: 'M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9V16h7v-2.1A6 6 0 0012 3z',
  heart: 'M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0112 7.6 4.3 4.3 0 0119.5 10c0 5.4-7.5 10-7.5 10z',
  ban: 'M12 21a9 9 0 100-18 9 9 0 000 18zM5.7 5.7l12.6 12.6',
  crosshair:
    'M12 19.5a7.5 7.5 0 100-15 7.5 7.5 0 000 15zM12 15a3 3 0 100-6 3 3 0 000 6zM12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2',
  search: 'M10.5 17.5a7 7 0 100-14 7 7 0 000 14zM15.5 15.5L20.5 20.5',
  phone: 'M7 3h10v18H7zM11 18h2',
  gift: 'M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7c-1.5-3-5-3.5-5-1s3 1 5 1zM12 7c1.5-3 5-3.5 5-1s-3 1-5 1z',
  // 업종 아이콘 (CATEGORIES의 value와 같은 이름)
  meal: 'M3.5 11h17a8.5 8.5 0 01-17 0zM8 4.5v3.5M12 3.5V8M16 4.5v3.5',
  cafe: 'M4.5 8.5h12v5a5 5 0 01-5 5h-2a5 5 0 01-5-5zM16.5 10h1.5a2.5 2.5 0 010 5h-1.8M7 3.5v2.5M11 3.5v2.5',
  bakery: 'M3 15.5c0-5 4-9 9-9s9 4 9 9zM9 7.2l1.5 8.3M15 7.2l-1.5 8.3M3 15.5h18v2H3z',
  snack: 'M6 3.5v7M4 3.5v4.5a2 2 0 004 0V3.5M6 10.5v10M15 20.5V3.5c2.5 0 4 3 4 7h-4',
  etc: 'M5.5 8h13l-1 12.5h-11zM9 8V6.5a3 3 0 016 0V8',
} as const;

export type IconName = keyof typeof PATHS;

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 20, className = '', strokeWidth = 1.8 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
