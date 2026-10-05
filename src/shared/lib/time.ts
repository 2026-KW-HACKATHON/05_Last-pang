/** 남은 시간 "mm:ss" (음수면 00:00) — 쿠폰 카운트다운 */
export function formatRemaining(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const minutes = String(Math.floor(totalSec / 60)).padStart(2, '0');
  const seconds = String(totalSec % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

/** 서버의 timestamptz(ISO)를 한국 시각으로 — 기기 시간대와 상관없이 KST로 보여준다 */
export const formatKstTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Seoul',
  });

/** 한국 날짜 'YYYY-MM-DD' (리포트 기간 파라미터용). en-CA 형식이 YYYY-MM-DD라 빌려 쓴다 */
export const toKstDateString = (date: Date) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(date);
