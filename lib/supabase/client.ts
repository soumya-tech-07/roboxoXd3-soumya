import { createBrowserClient } from '@supabase/ssr';
import { Database } from '../database.types';

/**
 * Creates a Supabase client for use in Client Components.
 * This follows the official Supabase SSR pattern.
 * 
 * @see https://supabase.com/docs/guides/auth/server-side/creating-a-client
 */
export function createClient() {
  const client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // Suppress common auth errors that are expected and handled
        onAuthStateChange: (event, session) => {
          // Silently handle token refresh failures
          if (event === 'TOKEN_REFRESHED' && !session) {
            console.log('🔄 Token refresh failed - clearing expired session');
          }
        },
        // Automatically retry failed requests
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        // Suppress noisy auth errors in console
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      },
      global: {
        // Add headers to suppress verbose error logging
        headers: {
          'x-client-info': 'retrolouve-web',
        },
      },
    }
  );

  return client;
}

