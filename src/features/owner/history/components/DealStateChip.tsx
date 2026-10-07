import { Badge } from '../../components/ui/Badge';
import { dealStateOf } from '../dealState';

import type { HistoryDeal } from '../api';

export function DealStateChip({ deal }: { deal: HistoryDeal }) {
  const state = dealStateOf(deal);
  return (
    <Badge tone={state.tone} withDot={state.label === 'LIVE'}>
      {state.label}
    </Badge>
  );
}
