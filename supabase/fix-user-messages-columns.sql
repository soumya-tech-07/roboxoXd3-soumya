-- ============================================================
-- Fix: Add missing columns to public.user_messages
-- Run in: Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================

-- Add each column if it doesn't exist (Postgres 9.5+)
ALTER TABLE public.user_messages ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.user_messages ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE public.user_messages ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.user_messages ADD COLUMN IF NOT EXISTS subject text;
ALTER TABLE public.user_messages ADD COLUMN IF NOT EXISTS message text;
ALTER TABLE public.user_messages ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.user_messages ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- Set NOT NULL where needed (only if you have no rows, or after backfilling)
-- If you have existing rows with NULLs, run these one by one after updating data:
-- UPDATE public.user_messages SET name = '' WHERE name IS NULL;
-- UPDATE public.user_messages SET email = '' WHERE email IS NULL;
-- UPDATE public.user_messages SET subject = '' WHERE subject IS NULL;
-- UPDATE public.user_messages SET message = '' WHERE message IS NULL;
-- ALTER TABLE public.user_messages ALTER COLUMN name SET NOT NULL;
-- ALTER TABLE public.user_messages ALTER COLUMN email SET NOT NULL;
-- ALTER TABLE public.user_messages ALTER COLUMN subject SET NOT NULL;
-- ALTER TABLE public.user_messages ALTER COLUMN message SET NOT NULL;

-- Reload schema cache so PostgREST sees the new columns
NOTIFY pgrst, 'reload schema';
