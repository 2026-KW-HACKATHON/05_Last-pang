// 웹 푸시 발송기 (C10). pg_cron → invoke_push_sender() → 이 함수. 브라우저에서 부르지 않는다
// push_queue의 pending 행을 꺼내 주민의 모든 기기(push_subscriptions)로 보내고 sent/failed로 바꾼다
// 비밀값: VAPID_PUBLIC_KEY · VAPID_PRIVATE_KEY · VAPID_SUBJECT(mailto:…) · PUSH_CRON_SECRET
// SUPABASE_URL · SUPABASE_SERVICE_ROLE_KEY는 Supabase가 자동으로 넣는다. 어떤 값도 코드에 적지 않는다
import { createClient } from 'npm:@supabase/supabase-js@2';
import webpush from 'npm:web-push@3.6.7';

import { json } from '../_shared/cors.ts';

const BATCH = 200;

type QueueRow = {
  id: number;
  user_id: string;
  deal_id: string;
  body: string | null; // 사람마다 다른 둘째 줄 (겹치는 비는 시간). 없으면 기본 문구
  deals: {
    title: string;
    deal_price: number;
    remaining_qty: number;
    total_qty: number;
    ends_at: string;
    stores: { name: string } | null;
  } | null;
};

const won = (n: number) => `${n.toLocaleString('ko-KR')}원`;
const hhmm = (iso: string) =>
  new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(iso));

// C10 문구 규칙: '선착순 사용'과 '사용 가능 N/M명'을 반드시 넣는다
function toPayload(row: QueueRow) {
  const deal = row.deals;
  if (!deal) return null;
  return JSON.stringify({
    title: '동네냠냠',
    body: `[할인] ${deal.stores?.name ?? ''} ${deal.title}\n${
      row.body ??
      `${won(deal.deal_price)} · 선착순 사용 ${deal.remaining_qty}/${deal.total_qty}명 · ${hhmm(deal.ends_at)}까지`
    }`,
    url: `/deals/${row.deal_id}?src=push`,
    tag: `deal-${row.deal_id}`,
  });
}

Deno.serve(async (req) => {
  if (req.headers.get('x-push-secret') !== Deno.env.get('PUSH_CRON_SECRET')) {
    return json({ ok: false, error: 'FORBIDDEN' }, 403);
  }
  const publicKey = Deno.env.get('VAPID_PUBLIC_KEY');
  const privateKey = Deno.env.get('VAPID_PRIVATE_KEY');
  if (!publicKey || !privateKey) return json({ ok: false, error: 'VAPID_NOT_SET' }, 500);
  webpush.setVapidDetails(
    Deno.env.get('VAPID_SUBJECT') ?? 'mailto:help@dongne-nyam.kr',
    publicKey,
    privateKey,
  );

  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
  const { data: rows, error } = await admin
    .from('push_queue')
    .select(
      'id, user_id, deal_id, body, deals(title, deal_price, remaining_qty, total_qty, ends_at, stores(name))',
    )
    .eq('status', 'pending')
    .order('created_at')
    .limit(BATCH);
  if (error) return json({ ok: false, error: error.message }, 500);

  let sent = 0;
  for (const row of (rows ?? []) as unknown as QueueRow[]) {
    const payload = toPayload(row);
    const { data: subs } = await admin
      .from('push_subscriptions')
      .select('id, endpoint, p256dh, auth')
      .eq('user_id', row.user_id);
    let delivered = false;
    for (const sub of subs ?? []) {
      if (!payload) break;
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload,
          { TTL: 60 * 30, urgency: 'high' },
        );
        delivered = true;
      } catch (e) {
        const status = (e as { statusCode?: number }).statusCode;
        // 404·410: 구독이 끝난 기기 → 지운다
        if (status === 404 || status === 410) {
          await admin.from('push_subscriptions').delete().eq('id', sub.id);
        }
      }
    }
    // 기기가 없으면 skipped (알림함에는 이미 남아 있다)
    const status = delivered ? 'sent' : (subs ?? []).length === 0 ? 'skipped' : 'failed';
    await admin
      .from('push_queue')
      .update({ status, sent_at: new Date().toISOString() })
      .eq('id', row.id);
    if (delivered) sent += 1;
  }
  return json({ ok: true, data: { picked: rows?.length ?? 0, sent } });
});
