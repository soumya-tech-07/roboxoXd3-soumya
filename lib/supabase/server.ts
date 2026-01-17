import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '../database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bjsnoccotxcviuahthmz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqc25vY2NvdHhjdml1YWh0aG16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0ODM5MjAsImV4cCI6MjA4MDA1OTkyMH0.9Zylcmcb9m4AP2OIYIt4BSdMvNM5WdTvW2JzGasKChM';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

/**
 * Server Supabase client using @supabase/ssr
 * 
 * Use this in Server Components, Server Actions, and API routes.
 * It properly handles cookies and session management for SSR.
 */
export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options?: { maxAge?: number; path?: string; domain?: string; sameSite?: string; secure?: boolean; httpOnly?: boolean }) {
          try {
            cookieStore.set(name, value, options);
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options?: { path?: string; domain?: string }) {
          try {
            cookieStore.set(name, '', { ...options, maxAge: 0 });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

