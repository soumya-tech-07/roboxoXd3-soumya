-- ============================================================
-- Run this entire script in: Supabase Dashboard → SQL Editor → New query
-- Then click "Run" to create the user_messages table.
-- ============================================================

create table if not exists public.user_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists user_messages_created_at_idx on public.user_messages (created_at desc);
create index if not exists user_messages_user_id_idx on public.user_messages (user_id);

alter table public.user_messages enable row level security;

create policy "Users can insert own message"
  on public.user_messages
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can read own messages"
  on public.user_messages
  for select
  to authenticated
  using (auth.uid() = user_id);

comment on table public.user_messages is 'Contact form submissions; one row per message from a user.';
