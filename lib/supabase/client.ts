import { createBrowserClient } from '@supabase/ssr';
import { Database } from '../database.types';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bjsnoccotxcviuahthmz.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqc25vY2NvdHhjdml1YWh0aG16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0ODM5MjAsImV4cCI6MjA4MDA1OTkyMH0.9Zylcmcb9m4AP2OIYIt4BSdMvNM5WdTvW2JzGasKChM';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

/**
 * Browser Supabase client using @supabase/ssr.
 * Use this in Client Components ('use client').
 */
export function createClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

// Backward compatibility: existing code imports `supabase` directly.
export const supabase = createClient();

