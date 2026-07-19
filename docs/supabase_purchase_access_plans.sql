-- Imperium Store purchase access plans
-- Run this migration in the Supabase SQL Editor before deploying the matching app code.
--
-- Existing paid rows become lifetime purchases. New monthly rows receive an
-- explicit access window only after Razorpay confirms payment.

alter table public.purchases
  add column if not exists access_type text not null default 'lifetime',
  add column if not exists access_starts_at timestamptz,
  add column if not exists access_expires_at timestamptz;

update public.purchases
set access_type = 'lifetime'
where access_type is null
   or access_type not in ('intro_month', 'monthly', 'lifetime');

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'purchases_access_type_check'
      and conrelid = 'public.purchases'::regclass
  ) then
    alter table public.purchases
      add constraint purchases_access_type_check
      check (access_type in ('intro_month', 'monthly', 'lifetime'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'purchases_access_window_check'
      and conrelid = 'public.purchases'::regclass
  ) then
    alter table public.purchases
      add constraint purchases_access_window_check
      check (
        access_type = 'lifetime'
        or status <> 'paid'
        or (
          access_starts_at is not null
          and access_expires_at is not null
          and access_expires_at > access_starts_at
        )
      );
  end if;
end
$$;

create index if not exists purchases_active_access_idx
  on public.purchases (user_id, product_id, access_expires_at desc)
  where status = 'paid';

-- A refunded introductory purchase still counts as an introductory offer use.
create unique index if not exists purchases_one_intro_month_per_customer_idx
  on public.purchases (user_id, product_id)
  where access_type = 'intro_month' and status in ('paid', 'refunded');

create or replace function public.activate_purchase_order(
  p_order_id text,
  p_status text,
  p_payment_id text default null,
  p_user_id text default null
)
returns setof public.purchases
language plpgsql
security definer
set search_path = public
as $$
declare
  purchase_row public.purchases%rowtype;
  period_start timestamptz;
begin
  if p_status not in ('paid', 'failed') then
    raise exception 'Unsupported purchase status';
  end if;

  if p_status = 'failed' then
    return query
      update public.purchases
      set
        status = 'failed',
        razorpay_payment_id = coalesce(p_payment_id, razorpay_payment_id)
      where razorpay_order_id = p_order_id
        and (p_user_id is null or user_id::text = p_user_id)
        and status <> 'paid'
      returning *;
    return;
  end if;

  for purchase_row in
    select *
    from public.purchases
    where razorpay_order_id = p_order_id
      and (p_user_id is null or user_id::text = p_user_id)
    order by created_at, id
  loop
    -- Serialize activation by customer and product before taking row locks.
    -- This prevents simultaneous renewal captures from deadlocking or using
    -- the same period start.
    perform pg_advisory_xact_lock(
      hashtextextended(
        purchase_row.user_id::text || ':' || purchase_row.product_id,
        0
      )
    );

    select *
    into purchase_row
    from public.purchases
    where id = purchase_row.id
    for update;

    if purchase_row.status = 'paid' then
      return next purchase_row;
      continue;
    end if;

    -- A second browser tab can create another introductory order before the
    -- first capture arrives. Never strand a captured payment: if the intro was
    -- already consumed, activate this captured row as a normal added month.
    if purchase_row.access_type = 'intro_month'
       and exists (
         select 1
         from public.purchases
         where user_id = purchase_row.user_id
           and product_id = purchase_row.product_id
           and id <> purchase_row.id
           and access_type = 'intro_month'
           and status in ('paid', 'refunded')
       )
    then
      update public.purchases
      set access_type = 'monthly'
      where id = purchase_row.id
      returning * into purchase_row;
    end if;

    if purchase_row.access_type = 'lifetime' then
      period_start := now();
      update public.purchases
      set
        status = 'paid',
        razorpay_payment_id = coalesce(p_payment_id, razorpay_payment_id),
        paid_at = coalesce(paid_at, now()),
        access_starts_at = period_start,
        access_expires_at = null
      where id = purchase_row.id
      returning * into purchase_row;
    else
      select greatest(
        now(),
        coalesce(max(access_expires_at), now())
      )
      into period_start
      from public.purchases
      where user_id = purchase_row.user_id
        and product_id = purchase_row.product_id
        and status = 'paid'
        and access_type in ('intro_month', 'monthly');

      update public.purchases
      set
        status = 'paid',
        razorpay_payment_id = coalesce(p_payment_id, razorpay_payment_id),
        paid_at = coalesce(paid_at, now()),
        access_starts_at = period_start,
        access_expires_at = period_start + interval '1 month'
      where id = purchase_row.id
      returning * into purchase_row;
    end if;

    return next purchase_row;
  end loop;
end
$$;

revoke all on function public.activate_purchase_order(text, text, text, text) from public;
grant execute on function public.activate_purchase_order(text, text, text, text) to service_role;

-- Desktop applications can call:
--   supabase.rpc('has_product_access', { p_product_id: '<product-slug>' })
-- with the signed-in user's access token. Do not authorize the terminal by
-- checking for any historical `paid` row, because monthly rows can expire.
create or replace function public.has_product_access(p_product_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.purchases
    where user_id = auth.uid()
      and product_id = p_product_id
      and status = 'paid'
      and (
        access_type = 'lifetime'
        or (
          access_type in ('intro_month', 'monthly')
          and access_expires_at > now()
        )
      )
  );
$$;

revoke all on function public.has_product_access(text) from public;
grant execute on function public.has_product_access(text) to authenticated;

comment on column public.purchases.access_type is
  'intro_month = first paid month, monthly = later one-month renewal, lifetime = permanent access';
comment on column public.purchases.access_expires_at is
  'Null for lifetime access; exclusive access end for monthly terms';
comment on function public.has_product_access(text) is
  'Authenticated entitlement check for desktop products; respects monthly expiry and lifetime access';
