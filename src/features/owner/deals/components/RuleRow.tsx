import { useNavigate } from 'react-router-dom';

import { formatPrice } from '@/shared/lib/format';

import { Toggle } from '../../components/ui/Toggle';
import { formatRepeatDays } from '../../lib/format';

import type { DealRule } from '../api';

interface RuleRowProps {
  rule: DealRule;
  isUpdating: boolean;
  onToggle: (isActive: boolean) => void;
}

/** "내 반복딜" 한 줄. 누르면 O5-1 수정 */
export function RuleRow({ rule, isUpdating, onToggle }: RuleRowProps) {
  const navigate = useNavigate();
  return (
    <div
      className={`flex items-center gap-3 rounded-card border border-line bg-surface p-4 ${rule.isActive ? '' : 'opacity-60'}`}
    >
      <button
        type="button"
        className="min-w-0 flex-1 text-left"
        onClick={() => navigate(`/owner/weekly-deals/${rule.id}`)}
      >
        <p className="truncate font-semibold">{rule.title}</p>
        <p className="mt-0.5 text-[13px] text-muted">
          {formatRepeatDays(rule.repeatDays)} · {rule.startTime}~{rule.endTime}
        </p>
        <p className="text-[13px] text-muted">
          {formatPrice(rule.dealPrice)} · {rule.qty}개 · 쿠폰 {rule.couponTtlMin}분
        </p>
      </button>
      <Toggle
        checked={rule.isActive}
        disabled={isUpdating}
        label={`${rule.title} 켜기`}
        onChange={onToggle}
      />
    </div>
  );
}
