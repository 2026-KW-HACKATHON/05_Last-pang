import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { CATEGORIES } from '@/shared/constants/domain';
import { formatPrice } from '@/shared/lib/format';
import { supabase } from '@/shared/lib/supabase';
import { Icon, type IconName } from '@/shared/ui/Icon';

const previewSchema = z.object({
  store_name: z.string(),
  category: z.string(),
  title: z.string(),
  original_price: z.number(),
  deal_price: z.number(),
});

async function fetchPreview(dealId: string) {
  const { data, error } = await supabase.rpc('get_shared_deal_preview', { p_deal_id: dealId });
  if (error) throw error;
  const parsed = previewSchema.safeParse(data);
  return parsed.success ? parsed.data : null;
}

// C3 로그인이 필요해요 · 공유받은 딜 링크. 딜을 못 읽어도 안내 문구는 보여 준다
export function SharedDealCard({ dealId }: { dealId: string }) {
  const preview = useQuery({
    queryKey: ['shared-deal', dealId],
    queryFn: () => fetchPreview(dealId),
    retry: false,
  });
  const deal = preview.data;
  const icon = (CATEGORIES.find((c) => c.value === deal?.category)?.value ?? 'etc') as IconName;

  return (
    <section className="mt-6 text-left">
      <div className="rounded-card bg-accent-tint p-4">
        <p className="text-xs font-semibold text-accent">친구가 공유한 딜이에요</p>
        {deal && (
          <div className="mt-3 flex items-center gap-3 rounded-card bg-surface p-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-[12px] bg-accent-tint text-accent">
              <Icon name={icon} size={22} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs text-muted">{deal.store_name}</p>
              <p className="truncate font-semibold">{deal.title}</p>
              <p className="mt-0.5">
                <span className="font-bold text-accent">{formatPrice(deal.deal_price)}</span>{' '}
                <span className="text-xs text-faint line-through">
                  {formatPrice(deal.original_price)}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
        <Icon name="lock" size={14} /> 로그인하면 이 딜로 바로 돌아와요
      </p>
    </section>
  );
}
