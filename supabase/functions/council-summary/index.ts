// 자치회 리포트 "이번 달 요약" 초안 (A5). 운영자만 부를 수 있다
// LLM에는 get_council_report의 집계 숫자만 보낸다. 주민 id·닉네임·좌표 같은 개인 정보는 보내지 않는다 (컨벤션 보안 규칙)
// 비밀값: ANTHROPIC_API_KEY (없으면 기본 문장으로 저장하고 source='template')
import { createClient } from 'npm:@supabase/supabase-js@2';

import { corsHeaders, json } from '../_shared/cors.ts';

type Report = {
  month: string;
  kpis: Record<string, { value: number | null; prev: number | null }>;
  zones: {
    name: string;
    hidden: boolean;
    share_pct: number | null;
    delta_pp: number | null;
    is_redistribution: boolean;
  }[];
  heatmap: { dow: number; hour: number; supply: number; used: number; free_people: number }[];
};

const DOW = ['', '월', '화', '수', '목', '금', '토', '일'];

// 개인 정보 없는 요약 숫자만 뽑는다
function toFacts(report: Report) {
  const k = report.kpis;
  const zones = report.zones
    .filter((z) => !z.hidden)
    .map(({ name, share_pct, delta_pp, is_redistribution }) => ({
      name,
      share_pct,
      delta_pp,
      is_redistribution,
    }));
  const gaps = [...report.heatmap]
    .filter((c) => c.free_people > 0)
    .sort((a, b) => b.free_people - b.supply * 10 - (a.free_people - a.supply * 10))
    .slice(0, 3)
    .map((c) => ({
      when: `${DOW[c.dow]} ${c.hour}시`,
      open_deals: c.supply,
      free_residents: c.free_people,
    }));
  return { month: report.month, kpis: k, zones, biggest_gaps: gaps };
}

function templateText(facts: ReturnType<typeof toFacts>): string {
  const month = Number(facts.month.slice(5, 7));
  const deals = facts.kpis.deals?.value ?? 0;
  const used = facts.kpis.used?.value ?? 0;
  const prevUsed = facts.kpis.used?.prev ?? 0;
  const change =
    prevUsed > 0
      ? ` (지난달보다 ${Math.round(((used - prevUsed) / prevUsed) * 100)}% ${used >= prevUsed ? '증가' : '감소'})`
      : '';
  const topZone = [...facts.zones].sort((a, b) => (b.delta_pp ?? -99) - (a.delta_pp ?? -99))[0];
  const zoneLine =
    topZone?.share_pct != null
      ? ` ${topZone.name}의 방문 비중이 ${topZone.share_pct}%${topZone.delta_pp != null ? `로 ${topZone.delta_pp}%p 바뀌었어요` : '예요'}.`
      : '';
  const gap = facts.biggest_gaps[0];
  const gapLine = gap
    ? ` ${gap.when}는 주민이 한가한 시간이 많지만 열린 딜이 적어, 이 시간대 참여를 사장님들께 권하면 좋겠어요.`
    : '';
  return `${month}월에는 딜 ${deals}건이 열려 쿠폰 ${used}장이 사용됐어요${change}.${zoneLine}${gapLine}`;
}

async function aiText(facts: ReturnType<typeof toFacts>): Promise<string | null> {
  const key = Deno.env.get('ANTHROPIC_API_KEY');
  if (!key) return null;
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system:
        '너는 동네 상권 리포트를 주민자치회에 보고하는 담당자다. 주어진 집계 숫자만 근거로 한국어 해요체 3문장(350자 이내)을 쓴다. ' +
        '숫자를 지어내지 말고, 없는 값은 언급하지 않는다. 마지막 문장은 자치회가 할 수 있는 제안 하나로 끝낸다.',
      messages: [{ role: 'user', content: JSON.stringify(facts) }],
    }),
  });
  if (!response.ok) return null;
  const body = await response.json();
  const text = body?.content?.[0]?.text;
  return typeof text === 'string' ? text.trim().slice(0, 1000) : null;
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    // 부른 사람의 토큰으로 RPC를 부른다 → 운영자가 아니면 get_council_report가 null을 돌려준다
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      {
        global: { headers: { Authorization: request.headers.get('Authorization') ?? '' } },
      },
    );
    const { month } = await request.json();
    if (typeof month !== 'string' || !/^\d{4}-\d{2}-01$/.test(month))
      return json({ ok: false, error: 'INVALID_INPUT' });

    const { data: report, error } = await supabase.rpc('get_council_report', { p_month: month });
    if (error) return json({ ok: false, error: 'UNKNOWN' }, 502);
    if (!report) return json({ ok: false, error: 'FORBIDDEN' }, 403);

    const facts = toFacts(report as Report);
    const ai = await aiText(facts);
    const text = ai ?? templateText(facts);
    const { data: saved, error: saveError } = await supabase.rpc('save_council_summary_draft', {
      p_month: month,
      p_text: text,
      p_source: ai ? 'ai' : 'template',
    });
    if (saveError || !saved?.ok) return json({ ok: false, error: saved?.error ?? 'UNKNOWN' });
    return json({ ok: true, data: { text, source: ai ? 'ai' : 'template' } });
  } catch (error) {
    console.error(error);
    return json({ ok: false, error: 'UNKNOWN' }, 500);
  }
});
