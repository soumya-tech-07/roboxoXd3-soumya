import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bjsnoccotxcviuahthmz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqc25vY2NvdHhjdml1YWh0aG16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0ODM5MjAsImV4cCI6MjA4MDA1OTkyMH0.9Zylcmcb9m4AP2OIYIt4BSdMvNM5WdTvW2JzGasKChM';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

/**
 * Browser Supabase client.
 *
 * Important: keep this configuration minimal and standard.
 * Session refresh/resume is handled in `app/context/AuthContext.jsx`
 * via `supabase.auth.startAutoRefresh()` / `stopAutoRefresh()`.
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    // Intercept all fetch requests to handle 401 errors globally
    fetch: async (url, options = {}) => {
      // Make the request
      const response = await fetch(url, options);
      
      // Handle 401 Unauthorized errors - reload page to reset state
      if (response.status === 401 && typeof window !== 'undefined') {
        // Only handle 401 for API requests, not auth endpoints or storage
        if (url.includes('/rest/v1/') && !url.includes('/auth/v1/')) {
          console.log('⚠️ Got 401 Unauthorized, clearing session and reloading...');
          
          // Clear expired token from localStorage
          localStorage.removeItem('sb-auth-token');
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('sb-')) {
              localStorage.removeItem(key);
            }
          });
          
          // Reload page to reset all state
          window.location.reload();
        }
      }
      
      return response;
    },
  },
});
