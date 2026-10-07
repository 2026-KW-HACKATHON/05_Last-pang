import { Icon } from '@/shared/ui/Icon';

const NOTICE_LINES = [
  '받은 쿠폰과 사용 기록이 모두 지워져요',
  '내 시간표와 좋아하는 가게 설정이 지워져요',
  '사장님 가게가 있으면 가게 운영도 함께 멈춰요',
  '같은 카카오 계정으로 다시 가입할 수 있어요',
];

// R14 탈퇴 전 안내: 지워지는 것 목록
export function WithdrawNotice() {
  return (
    <ul className="mt-6 space-y-3 rounded-card bg-gray p-4 text-sm text-muted">
      {NOTICE_LINES.map((line) => (
        <li key={line} className="flex items-center gap-2">
          <Icon name="check" size={18} className="text-accent" />
          {line}
        </li>
      ))}
    </ul>
  );
}
