import type { CouncilReport, HeatCell } from './api';

export const DOW_LABELS = ['', '월', '화', '수', '목', '금', '토', '일'] as const;

/** 공급(열린 딜)은 적은데 수요(한가한 주민)가 많은 칸 — 상위 몇 개를 "격차 큼"으로 표시 */
export function gapScore(cell: HeatCell): number {
  return cell.free_people - cell.supply * 10;
}

export function biggestGaps(cells: HeatCell[], count = 6): Set<string> {
  const top = [...cells]
    .filter((cell) => cell.free_people > 0)
    .sort((a, b) => gapScore(b) - gapScore(a))
    .slice(0, count);
  return new Set(top.map((cell) => `${cell.dow}-${cell.hour}`));
}

/** AI 요약을 못 만들 때 쓰는 기본 문장 (집계 숫자만 사용) */
export function templateSummary(report: CouncilReport): string {
  const month = Number(report.month.slice(5, 7));
  const used = report.kpis.used.value ?? 0;
  const prev = report.kpis.used.prev ?? 0;
  const change =
    prev > 0
      ? `(지난달보다 ${Math.round(((used - prev) / prev) * 100)}% ${used >= prev ? '증가' : '감소'})`
      : '';
  const gap = [...report.heatmap].sort((a, b) => gapScore(b) - gapScore(a))[0];
  const gapText =
    gap && gap.free_people > 0
      ? ` ${DOW_LABELS[gap.dow]} ${gap.hour}시는 주민이 한가한 시간이 많지만 열린 딜이 적어, 이 시간대 참여를 사장님들께 권하면 좋겠어요.`
      : '';
  return `${month}월에는 딜 ${report.kpis.deals.value ?? 0}건이 열려 쿠폰 ${used}장이 사용됐어요${change}.${gapText}`;
}

/** 표 내려받기 (엑셀에서 한글이 깨지지 않게 BOM을 붙인다) */
export function toCsv(report: CouncilReport): string {
  const rows = [
    ['구분', '항목', '값'],
    ['지표', '딜 등록', report.kpis.deals.value],
    ['지표', '쿠폰 받음', report.kpis.claimed.value],
    ['지표', '사용 완료', report.kpis.used.value],
    ['지표', '참여 가게', report.kpis.stores.value],
    ['지표', '처음 온 손님 비율(%)', report.kpis.first_visit_pct.value],
    ...report.zones.map((zone) => [
      '구역 방문 비중(%)',
      zone.name,
      zone.hidden ? '비공개' : zone.share_pct,
    ]),
    ...report.heatmap.map((cell) => [
      '요일×시간',
      `${DOW_LABELS[cell.dow]} ${cell.hour}시`,
      `딜 ${cell.supply} / 사용 ${cell.used} / 한가한 주민 ${cell.free_people}`,
    ]),
  ];
  return (
    '﻿' + rows.map((row) => row.map((value) => `"${String(value ?? '')}"`).join(',')).join('\n')
  );
}
