-- User messages table: stores contact form submissions so you can see who sent what.
-- Run this in Supabase SQL Editor if you're not using Supabase CLI migrations.

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

-- Index for listing messages by time and by user
create index if not exists user_messages_created_at_idx on public.user_messages (created_at desc);
create index if not exists user_messages_user_id_idx on public.user_messages (user_id);

-- RLS
alter table public.user_messages enable row level security;

-- Authenticated users can insert their own message (user_id must be their id)
create policy "Users can insert own message"
  on public.user_messages
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Users can read only their own messages (optional; for "my messages" later)
create policy "Users can read own messages"
  on public.user_messages
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Admin / dashboard: use service role key to read all rows, or add a policy for a specific admin role later.

comment on table public.user_messages is 'Contact form submissions; one row per message from a user.';
