#!/usr/bin/env bash
# supabase/tests/claim_concurrency.sh — 수량 5개 딜에 주민 20명이 동시에 claim_coupon
# 로컬 DB 주소는 supabase start 출력의 "DB URL" (기본 예: postgresql://postgres:postgres@127.0.0.1:54322/postgres)
set -euo pipefail
DB_URL="${DB_URL:-postgresql://postgres:postgres@127.0.0.1:54322/postgres}"

DEAL_ID=$(psql "$DB_URL" -qtA -c "
  insert into deals (store_id, type, title, original_price, deal_price, starts_at, ends_at, total_qty, remaining_qty)
  values ('10000000-0000-0000-0000-000000000001', 'instant', '동시성 테스트', 1000, 500,
          now(), now() + interval '1 hour', 5, 5)
  returning id;")
echo "테스트 딜: $DEAL_ID"

for n in $(seq 5 24); do            # 시드의 주민 20명 (5~24번)
  USER_ID=$(printf '00000000-0000-0000-0000-%012d' "$n")
  psql "$DB_URL" -qtA -c "
    begin;
    set local role authenticated;
    set local request.jwt.claims = '{\"sub\":\"$USER_ID\",\"role\":\"authenticated\"}';
    select claim_coupon('$DEAL_ID')->>'ok';
    commit;" &
done
wait

ISSUED=$(psql "$DB_URL" -qtA -c "select count(*) from coupons where deal_id = '$DEAL_ID';")
REMAINING=$(psql "$DB_URL" -qtA -c "select remaining_qty from deals where id = '$DEAL_ID';")
echo "요청 20건 → 발급 ${ISSUED}건, 남은 수량 ${REMAINING}"
if [ "$ISSUED" = "5" ] && [ "$REMAINING" = "0" ]; then echo "통과"; else echo "실패"; exit 1; fi
