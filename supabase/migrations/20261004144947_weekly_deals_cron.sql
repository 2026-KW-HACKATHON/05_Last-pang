-- deal_rules(규칙) → 오늘 요일이면 deals(실제 딜) 생성
create or replace function public.generate_weekly_deals()
returns void language sql security definer set search_path = public as $$
  insert into deals (store_id, rule_id, type, title, original_price, deal_price,
                     starts_at, ends_at, total_qty, remaining_qty, coupon_ttl_min)
  select r.store_id, r.id, 'weekly', r.title, r.original_price, r.deal_price,
         ((now() at time zone 'Asia/Seoul')::date + r.start_time) at time zone 'Asia/Seoul',
         ((now() at time zone 'Asia/Seoul')::date + r.end_time) at time zone 'Asia/Seoul',
         r.qty, r.qty, r.coupon_ttl_min
  from deal_rules r
  join stores s on s.id = r.store_id and s.status = 'approved'
  where r.is_active
    and extract(dow from now() at time zone 'Asia/Seoul')::smallint = any (r.repeat_days)
    and not exists (   -- 같은 날 두 번 만들지 않기
      select 1 from deals d
      where d.rule_id = r.id and (d.starts_at at time zone 'Asia/Seoul')::date = (now() at time zone 'Asia/Seoul')::date
    );
$$;

revoke all on function public.generate_weekly_deals() from public, anon, authenticated;

-- pg_cron은 UTC 기준: 15:05 UTC = 한국 00:05
select cron.schedule('generate-weekly-deals', '5 15 * * *', 'select public.generate_weekly_deals()');
