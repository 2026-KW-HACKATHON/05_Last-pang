import { useState } from 'react';

import { Icon } from '@/features/owner/components/Icon';

import type { CouncilReport } from '../api';

type Zone = CouncilReport['zones'][number];

/** 비중 큰 순, 비공개(표본 부족) 구역은 맨 아래 */
function sortZones(zones: Zone[]): Zone[] {
  return [...zones].sort((a, b) => {
    if (a.hidden !== b.hidden) return a.hidden ? 1 : -1;
    return (b.share_pct ?? 0) - (a.share_pct ?? 0);
  });
}

function ZoneValue({ zone }: { zone: Zone }) {
  if (zone.hidden) return <span className="text-xs text-faint">비공개 (표본 부족)</span>;
  return (
    <span className="flex items-center gap-1.5">
      <b className="text-sm">{zone.share_pct}%</b>
      {zone.delta_pp !== null && (
        <span className={`text-xs ${zone.delta_pp > 0 ? 'text-success' : 'text-muted'}`}>
          {zone.delta_pp > 0 ? '+' : ''}
          {zone.delta_pp}%p
        </span>
      )}
    </span>
  );
}

/** A5 구역별 방문 비중 (쿠폰 사용 기준). 표본 10명 미만 구역은 숨긴다 */
export function ZoneShareCard({ zones }: { zones: CouncilReport['zones'] }) {
  const [isTable, setIsTable] = useState(false);
  const sorted = sortZones(zones);
  const max = Math.max(1, ...zones.map((zone) => zone.share_pct ?? 0));

  return (
    <section className="rounded-card bg-surface px-6 pt-6 pb-6 ring-1 ring-line">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[17px] font-bold">구역별 방문 비중</h2>
          <p className="mt-1.5 text-xs text-faint">쿠폰 사용 기준 · 단위 %</p>
        </div>
        <button
          type="button"
          className="pt-3 text-[13px] text-muted hover:text-ink"
          onClick={() => setIsTable((value) => !value)}
        >
          {isTable ? '막대로 보기' : '표로 보기'}
        </button>
      </div>

      {isTable ? (
        <table className="mt-6 w-full text-[13px]">
          <thead className="text-left text-xs text-faint">
            <tr className="border-b border-line">
              <th className="pb-2 font-normal">구역</th>
              <th className="pb-2 text-right font-normal">비중</th>
              <th className="pb-2 text-right font-normal">지난달 대비</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((zone) => (
              <tr key={zone.id} className="border-b border-line">
                <td className="py-2.5">
                  {zone.name}
                  {zone.is_redistribution && (
                    <span className="ml-1.5 text-xs text-accent">재분배</span>
                  )}
                </td>
                <td className="text-right font-bold">
                  {zone.hidden ? '비공개' : `${zone.share_pct}%`}
                </td>
                <td className="text-right text-muted">
                  {zone.hidden || zone.delta_pp === null
                    ? '–'
                    : `${zone.delta_pp > 0 ? '+' : ''}${zone.delta_pp}%p`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <ul className="mt-6 space-y-3.5">
          {sorted.map((zone) => (
            <li
              key={zone.id}
              className="grid grid-cols-[110px_1fr_80px] items-center gap-3 text-[13px]"
            >
              <span className="leading-tight">
                {zone.name}
                {zone.is_redistribution && (
                  <span className="block text-xs text-accent">재분배 구역</span>
                )}
              </span>
              {zone.hidden ? (
                <span className="col-span-2 text-right">
                  <ZoneValue zone={zone} />
                </span>
              ) : (
                <>
                  <span className="h-[22px]">
                    <span
                      className={`block h-full rounded-[3px] ${zone.is_redistribution ? 'bg-accent' : 'bg-accent/55'}`}
                      style={{ width: `${((zone.share_pct ?? 0) / max) * 100}%` }}
                    />
                  </span>
                  <ZoneValue zone={zone} />
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-5 flex items-center gap-2 text-xs text-muted">
        <Icon name="info" size={13} className="shrink-0" />
        표본이 10명 미만인 구역은 수치를 숨겨요. 재분배 구역 딜은 노출 가중치 1.5배가 적용돼요.
      </p>
    </section>
  );
}
