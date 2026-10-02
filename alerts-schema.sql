-- ============================================================
-- TickSignal county alert subscriptions — Supabase schema
-- Free-tier compatible. No secrets in this file.
-- Run ONCE in the Supabase dashboard SQL editor (one paste, in order).
-- Companion: SETUP.md (human steps) in this repo.
-- ============================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- 1. subscribers table
-- One row per (email, county). County-level ONLY — no addresses,
-- no GPS, no names. Emails are NEVER exposed to anon/RLS.
-- ------------------------------------------------------------
create table if not exists public.subscribers (
  id               uuid        primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  email            text        not null check (email = lower(email))
                   check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  county           text        not null check (char_length(county) between 3 and 60),
  active           boolean     not null default true,
  unsubscribe_token uuid       not null default gen_random_uuid() unique,
  constraint subscribers_email_county_unique unique (email, county)
);

comment on table public.subscribers is
  'Free weekly tick/mosquito sighting-count alert subscriptions. County-level only; emails never exposed via RLS.';
comment on column public.subscribers.unsubscribe_token is
  'Secret per-subscription token. The only thing that can deactivate a row via anon is the unsubscribe_alerts() RPC.';

create index if not exists idx_subscribers_active_county
  on public.subscribers (active, county);

-- ------------------------------------------------------------
-- 2. Row Level Security
-- anon may INSERT (signup form) but can never SELECT/UPDATE/DELETE.
-- The weekly digest job uses the service_role key (server-side only).
-- ------------------------------------------------------------
alter table public.subscribers enable row level security;

drop policy if exists "anon_insert_alert_subscriptions" on public.subscribers;
create policy "anon_insert_alert_subscriptions"
  on public.subscribers
  for insert
  to anon
  with check (
    active = true
    and county <> ''
  );

-- No SELECT / UPDATE / DELETE policies for anon or authenticated:
-- subscriber emails stay private. (Admin review of subscriber counts
-- can be done via service_role in the digest job logs.)

-- ------------------------------------------------------------
-- 3. One-click unsubscribe (SECURITY DEFINER function)
-- The static unsubscribe.html page calls this via anon RPC with the
-- token from the email link. It can only deactivate the single row
-- matching the token — nothing else is reachable.
-- ------------------------------------------------------------
create or replace function public.unsubscribe_alerts(p_token uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  update public.subscribers
     set active = false
   where unsubscribe_token = p_token
     and active = true
  returning id into v_id;
  return v_id is not null;
end;
$$;

revoke all on function public.unsubscribe_alerts(uuid) from public;
grant execute on function public.unsubscribe_alerts(uuid) to anon;

comment on function public.unsubscribe_alerts(uuid) is
  'One-click unsubscribe for alert emails. Deactivates only the row matching the token.';
