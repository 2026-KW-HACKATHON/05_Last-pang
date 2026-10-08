import { Icon } from '@/shared/ui/Icon';

import { GUIDE_TROUBLES } from '../guideContent';

import type { Platform } from '../platform';

// 막힐 때: 질문을 누르면 답이 펼쳐진다
export function TroubleList({ platform }: { platform: Platform }) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 text-sm font-bold text-muted">막힐 때</h2>
      <ul className="divide-y divide-line rounded-card ring-1 ring-line">
        {GUIDE_TROUBLES[platform].map((item) => (
          <li key={item.q}>
            <details className="group px-4">
              <summary className="flex h-12 cursor-pointer list-none items-center justify-between text-sm font-semibold [&::-webkit-details-marker]:hidden">
                {item.q}
                <Icon
                  name="chevronDown"
                  size={18}
                  className="text-faint transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="pb-4 text-[13px] leading-5 text-muted">{item.a}</p>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
