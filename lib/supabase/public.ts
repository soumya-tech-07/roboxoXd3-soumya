import { createClient } from '@supabase/supabase-js';
import { Database } from '../database.types';

/**
 * A lightweight, auth-free Supabase client for public data (products, etc.).
 *
 * Why this exists:
 * The SSR browser client (`createBrowserClient`) manages auth sessions and
 * QUEUES all pending queries while a token refresh is in progress. For a
 * logged-in user whose access token has just expired, every product fetch is
 * held internally until the refresh network call completes (or fails). This
 * makes it look like "no API calls are being made" in the Network tab, and
 * causes the entire homepage to appear stuck.
 *
 * Public product data does not require authentication — it is readable by the
 * anon role via RLS. Using a separate client here ensures product queries are
 * always fired immediately with the anon key, completely bypassing the token
 * refresh queue.
 *
 * DO NOT use this client for auth-protected operations (orders, profile, cart).
 * Use `createClient` from `@/lib/supabase` for those instead.
 */

let publicClientInstance: ReturnType<typeof createClient<Database>> | null = null;

export function createPublicClient() {
  if (publicClientInstance) return publicClientInstance;

  publicClientInstance = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );

  return publicClientInstance;
}
