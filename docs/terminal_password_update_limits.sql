-- Imperium terminal password update cooldown.
-- Run this in Supabase SQL Editor before enabling the protected
-- /api/auth/terminal-password route in production.

create table if not exists public.terminal_password_update_limits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  last_updated_at timestamptz not null,
  updated_at timestamptz not null default now()
);

alter table public.terminal_password_update_limits enable row level security;

drop policy if exists "No direct terminal password cooldown access" on public.terminal_password_update_limits;

-- No public policies are created on purpose. The store backend reads and writes
-- this table with the service-role key after validating the signed-in user.

create or replace function public.claim_terminal_password_update(
  p_user_id uuid,
  p_cooldown_seconds integer default 900
)
returns table (
  allowed boolean,
  last_updated_at timestamptz,
  next_allowed_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_last_updated_at timestamptz;
  v_cooldown interval := make_interval(secs => greatest(p_cooldown_seconds, 1));
begin
  if p_user_id is null then
    raise exception 'p_user_id is required';
  end if;

  select limits.last_updated_at
  into v_last_updated_at
  from public.terminal_password_update_limits as limits
  where limits.user_id = p_user_id
  for update;

  if v_last_updated_at is not null and v_last_updated_at + v_cooldown > v_now then
    allowed := false;
    last_updated_at := v_last_updated_at;
    next_allowed_at := v_last_updated_at + v_cooldown;
    return next;
    return;
  end if;

  insert into public.terminal_password_update_limits (
    user_id,
    last_updated_at,
    updated_at
  )
  values (
    p_user_id,
    v_now,
    v_now
  )
  on conflict (user_id)
  do update set
    last_updated_at = excluded.last_updated_at,
    updated_at = excluded.updated_at
  returning terminal_password_update_limits.last_updated_at
  into v_last_updated_at;

  allowed := true;
  last_updated_at := v_last_updated_at;
  next_allowed_at := v_last_updated_at + v_cooldown;
  return next;
end;
$$;

revoke all on function public.claim_terminal_password_update(uuid, integer) from public;
revoke all on function public.claim_terminal_password_update(uuid, integer) from anon;
revoke all on function public.claim_terminal_password_update(uuid, integer) from authenticated;
grant execute on function public.claim_terminal_password_update(uuid, integer) to service_role;
