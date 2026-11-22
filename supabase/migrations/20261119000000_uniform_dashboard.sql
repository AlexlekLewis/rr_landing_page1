-- Uniform dashboard (/rramadmin_26/uniforms). Power Shop agent, 19 Nov 2026.
--
-- Andy: "manage uniform stock take as well as the handing out of uniform to players, as well as search the database
-- for player uniforms, orders, sizing, and what they ordered."
--
-- Stock itself lives in store_stock_moves / store_stock_position (Alex's store_* tables). This adds:
--   store_uniform_lines()  every uniform line owed to or bought by a player, from every place kit is sold or promised,
--                          with its size, the stock size it maps to, and whether it has been handed out.
--   store_hand_out(...)    records a hand-out: takes it off stock (a store_stock_moves row that points back at the
--                          order or entitlement) and, for an entitlement, marks it handed over.
-- Both are dashboard-users only (is_dashboard_user()), like every store_* table.

create or replace function public.store_uniform_lines()
returns table (
  source text,            -- entitlement | kit_order | shop_order | power_game
  source_id uuid,
  line_no int,
  ordered_at timestamptz,
  player text,
  contact text,
  email text,
  phone text,
  program text,
  centre text,
  product_slug text,
  product_name text,
  size_label text,        -- the size as the family chose it (null when it was never asked)
  variant_id uuid,        -- the matching stock size, null when the size is unknown
  qty int,
  paid boolean,
  handed_qty int,
  status text             -- to_hand_out | handed_out | size_needed | unpaid | cancelled | refunded
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not is_dashboard_user() then
    raise exception 'not authorised';
  end if;

  return query
  with
  issued as (
    select m.ref_type, m.ref_id, m.variant_id, (-sum(m.qty))::int as q
    from store_stock_moves m
    where m.ref_type is not null and m.ref_id is not null
    group by 1, 2, 3
  ),
  raw as (
    -- Shirts owed with a program registration (Junior Royals etc.)
    select 'entitlement'::text as src, e.id as sid, 1 as ln, e.created_at as at,
           e.person_name as pl, null::text as ct, e.parent_email as em, null::text as ph,
           e.program_label as pr, e.centre_key as ce,
           'training-shirt'::text as slug,
           coalesce((select v.size_label from store_variants v where v.id = e.variant_id), nullif(e.size_label_raw, '')) as sz,
           e.variant_id as vid, 1 as q, true as pd,
           case e.status when 'handed_over' then 'done' when 'cancelled' then 'cancelled' else null end as flag
    from store_entitlements e

    union all
    -- Performance Squad kit orders
    select 'kit_order', o.id, x.n::int, o.created_at,
           nullif(trim(coalesce(o.player_first_name, '') || ' ' || coalesce(o.player_last_name, '')), ''),
           o.parent_name, o.email, o.mobile, 'Performance Squad kit', coalesce(o.venue_name, o.centre_slug),
           case x.i->>'key' when 'shirt' then 'training-shirt' when 'pants' then 'training-pants'
                when 'shorts' then 'training-shorts' when 'cap' then 'pink-cap' when 'jacket' then 'fleece-jacket' end,
           x.i->>'size', null::uuid, coalesce((x.i->>'quantity')::int, 1), o.status = 'paid', null
    from performance_squad_kit_orders o, jsonb_array_elements(coalesce(o.items, '[]'::jsonb)) with ordinality x(i, n)

    union all
    -- Academy Shop orders (training kit and made-to-order)
    select 'shop_order', s.id, x.n::int, s.created_at,
           s.customer_name, s.customer_name, s.customer_email, s.customer_phone, 'Academy Shop',
           coalesce(s.pickup_venue, s.fulfillment_method),
           case
             when coalesce(x.i->>'product_id', '') <> '' then x.i->>'product_id'
             when (x.i->>'name') ~* 'IPL|Replica' then 'ipl-replica-shirt'
             when (x.i->>'name') ~* 'Shorts' then 'training-shorts'
             when (x.i->>'name') ~* 'Pants|Trouser' then 'training-pants'
             when (x.i->>'name') ~* 'Jacket' then 'fleece-jacket'
             when (x.i->>'name') ~* 'Cap' then 'pink-cap'
             when (x.i->>'name') ~* 'Shirt' then 'training-shirt'
           end,
           nullif(x.i->>'size', ''), null::uuid, coalesce((x.i->>'quantity')::int, 1),
           s.payment_status in ('completed', 'partially_refunded'),
           case when s.payment_status = 'refunded' then 'refunded'
                when s.fulfillment_status = 'fulfilled' then 'done' end
    from shop_orders_training s, jsonb_array_elements(coalesce(s.items, '[]'::jsonb)) with ordinality x(i, n)
    where coalesce(x.i->>'name', x.i->>'product_name', '') !~* 'surcharge|delivery'

    union all
    select 'shop_order', s.id, x.n::int, s.created_at,
           s.customer_name, s.customer_name, s.customer_email, s.customer_phone, 'Academy Shop (made to order)',
           coalesce(s.pickup_venue, s.fulfillment_method),
           coalesce(nullif(x.i->>'product_id', ''), case when (x.i->>'name') ~* 'Jacket' then 'fleece-jacket' else 'ipl-replica-shirt' end),
           nullif(x.i->>'size', ''), null::uuid, coalesce((x.i->>'quantity')::int, 1),
           s.payment_status in ('completed', 'partially_refunded'),
           case when s.payment_status = 'refunded' then 'refunded'
                when s.supplier_status = 'delivered' then 'done' end
    from shop_orders_ipl s, jsonb_array_elements(coalesce(s.items, '[]'::jsonb)) with ordinality x(i, n)
    where coalesce(x.i->>'name', x.i->>'product_name', '') !~* 'surcharge|delivery'

    union all
    -- Power Game kit (stored as text: "Royals Academy Training Shirt (32), Royals Academy Training Shorts (15–16)")
    select 'power_game', a.id, m.n::int, a.created_at,
           coalesce(nullif(a.player_name, ''), nullif(trim(coalesce(a.first_name, '') || ' ' || coalesce(a.last_name, '')), '')),
           a.parent1_name, coalesce(a.parent1_email, a.email), null, 'Power Game', a.venue,
           case m.r[1] when 'Training Shirt' then 'training-shirt' when 'Training Pants' then 'training-pants'
                when 'Training Shorts' then 'training-shorts' when 'Cap' then 'pink-cap' when 'Fleece Jacket' then 'fleece-jacket' end,
           m.r[2], null::uuid, 1, a.payment_status = 'completed', null
    from power_game_applications a,
         regexp_matches(a.uniform_selection, '(Training Shirt|Training Pants|Training Shorts|Fleece Jacket|Cap)\s*\(((?:[^()]|\([^()]*\))*)\)', 'g')
           with ordinality m(r, n)
    where coalesce(a.uniform_selection, '') <> ''
  ),
  matched as (
    select r.*,
           coalesce(r.vid, (select v.id from store_variants v join store_products p on p.id = v.product_id
                            where p.slug = r.slug and lower(v.size_label) = lower(r.sz) limit 1),
                    (select v.id from store_variants v join store_products p on p.id = v.product_id
                      where p.slug = r.slug and v.size_group = 'one_size' limit 1)) as variant
    from raw r
  )
  select mt.src, mt.sid, mt.ln, mt.at, mt.pl, mt.ct, mt.em, mt.ph, mt.pr, mt.ce,
         mt.slug, p.name, mt.sz, mt.variant, mt.q, mt.pd,
         coalesce(i.q, 0),
         case
           when mt.flag = 'cancelled' then 'cancelled'
           when mt.flag = 'refunded' then 'refunded'
           when mt.flag = 'done' or coalesce(i.q, 0) >= mt.q then 'handed_out'
           when not mt.pd then 'unpaid'
           when mt.variant is null then 'size_needed'
           else 'to_hand_out'
         end
  from matched mt
  left join store_products p on p.slug = mt.slug
  left join issued i on i.ref_type = mt.src and i.ref_id = mt.sid and i.variant_id = mt.variant;
end;
$$;

revoke all on function public.store_uniform_lines() from public, anon;
grant execute on function public.store_uniform_lines() to authenticated;


create or replace function public.store_hand_out(
  p_source text,
  p_source_id uuid,
  p_variant_id uuid,
  p_qty int default 1,
  p_location text default 'hq',
  p_note text default null,
  p_take_from_stock boolean default true   -- false: handed out before the last stock count, so already off the shelf
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_location uuid;
begin
  if not is_dashboard_user() then
    raise exception 'not authorised';
  end if;
  if p_source not in ('entitlement', 'kit_order', 'shop_order', 'power_game') then
    raise exception 'unknown source %', p_source;
  end if;
  if p_variant_id is null then
    raise exception 'choose a size before handing out';
  end if;
  if coalesce(p_qty, 0) < 1 then
    raise exception 'quantity must be at least 1';
  end if;

  select id into v_location from store_locations where key = coalesce(p_location, 'hq');
  if v_location is null then
    raise exception 'unknown location %', p_location;
  end if;

  insert into store_stock_moves (variant_id, location_id, qty, reason, ref_type, ref_id, note, created_by)
  values (p_variant_id, v_location, -p_qty,
          case when p_source = 'entitlement' then 'entitlement_issue' else 'sale' end,
          p_source, p_source_id,
          coalesce(p_note, 'Handed out') || ' (by ' || coalesce(auth.jwt() ->> 'email', 'dashboard') || ')',
          auth.uid());

  -- Handed out before the last count: the count already excludes it, so put the same number back with a balancing
  -- adjustment. The line still shows as handed out; on-hand stock doesn't change.
  if not coalesce(p_take_from_stock, true) then
    insert into store_stock_moves (variant_id, location_id, qty, reason, note, created_by)
    values (p_variant_id, v_location, p_qty, 'adjustment',
            'Balancing entry: ' || p_source || ' ' || p_source_id || ' was handed out before the last stock count', auth.uid());
  end if;

  if p_source = 'entitlement' then
    update store_entitlements
       set status = 'handed_over', handed_over_at = now(), handed_over_by = auth.uid(),
           variant_id = coalesce(variant_id, p_variant_id), location_id = v_location, updated_at = now()
     where id = p_source_id;
  end if;
end;
$$;

revoke all on function public.store_hand_out(text, uuid, uuid, int, text, text, boolean) from public, anon;
grant execute on function public.store_hand_out(text, uuid, uuid, int, text, text, boolean) to authenticated;
