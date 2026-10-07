import { useState } from 'react';

import type { CouncilReport } from '../api';

/** A5 구역별 방문 비중 (쿠폰 사용 기준). 표본 10명 미만 구역은 숨긴다 */
export function ZoneShareCard({ zones }: { zones: CouncilReport['zones'] }) {
  const [isTable, setIsTable] = useState(false);
  const max = Math.max(1, ...zones.map((zone) => zone.share_pct ?? 0));
  return (
    <section className="rounded-card bg-surface p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold">구역별 방문 비중</h2>
          <p className="text-[13px] text-muted">쿠폰 사용 기준 · 단위 %</p>
        </div>
        <button
          type="button"
          className="text-[13px] text-muted underline"
          onClick={() => setIsTable((value) => !value)}
        >
          {isTable ? '막대로 보기' : '표로 보기'}
        </button>
      </div>
      <ul className="mt-5 space-y-4">
        {zones.map((zone) => (
          <li
            key={zone.id}
            className={
              isTable
                ? 'flex justify-between border-b border-line pb-2 text-sm'
                : 'grid grid-cols-[110px_1fr_130px] items-center gap-3 text-sm'
            }
          >
            <span>
              {zone.name}
              {zone.is_redistribution && (
                <span className="block text-xs text-accent">재분배 구역</span>
              )}
            </span>
            {!isTable && (
              <span className="h-3 overflow-hidden rounded-pill bg-gray">
                {!zone.hidden && (
                  <span
                    className={`block h-full rounded-pill ${zone.is_redistribution ? 'bg-accent-pressed' : 'bg-accent/60'}`}
                    style={{ width: `${((zone.share_pct ?? 0) / max) * 100}%` }}
                  />
                )}
              </span>
            )}
            <span className="text-right">
              {zone.hidden ? (
                <span className="text-faint">비공개 (표본 부족)</span>
              ) : (
                <>
                  <b>{zone.share_pct}%</b>{' '}
                  {zone.delta_pp !== null && (
                    <span className={zone.delta_pp >= 0 ? 'text-success' : 'text-danger'}>
                      {zone.delta_pp >= 0 ? '+' : ''}
                      {zone.delta_pp}%p
                    </span>
                  )}
                </>
              )}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-xs text-muted">
        ⓘ 표본이 10명 미만인 구역은 수치를 숨겨요. 재분배 구역 딜은 노출 가중치 1.5배가 적용돼요.
      </p>
    </section>
  );
}
