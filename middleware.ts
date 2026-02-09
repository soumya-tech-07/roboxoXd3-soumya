import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * Supabase SSR session refresh middleware.
 *
 * This is REQUIRED when using `@supabase/ssr` with Next.js App Router to keep
 * auth cookies in sync on every request (including RSC `?_rsc` requests).
 * 
 * NOTE: You may see "AuthApiError: Invalid Refresh Token" in server logs.
 * This is EXPECTED when users have expired auth tokens and is handled gracefully
 * by clearing the invalid cookies. These errors do not affect functionality.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If env vars are missing, don't break the app at the middleware layer.
  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // Update response cookies (request cookies are read-only)
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  // IMPORTANT: This call refreshes the session if needed.
  // We intentionally ignore the result; cookie mutations are the goal.
  try {
    const { error } = await supabase.auth.getUser();
    
    // If we get auth errors (expired/invalid tokens), clear all auth cookies
    if (error) {
      const isAuthError = 
        error.message?.includes('refresh_token_not_found') ||
        error.message?.includes('invalid_grant') ||
        error.message?.includes('JWT') ||
        error.status === 400;
      
      if (isAuthError) {
        // Clear all Supabase auth cookies to prevent repeated errors
        const authCookies = request.cookies.getAll().filter(cookie => 
          cookie.name.includes('sb-') || cookie.name.includes('supabase')
        );
        
        authCookies.forEach(cookie => {
          response.cookies.delete(cookie.name);
        });
      }
    }
  } catch {
    // Never break page loads due to auth refresh hiccups.
    // Clear auth cookies on any error to prevent repeated issues
    const authCookies = request.cookies.getAll().filter(cookie => 
      cookie.name.includes('sb-') || cookie.name.includes('supabase')
    );
    
    authCookies.forEach(cookie => {
      response.cookies.delete(cookie.name);
    });
  }

  return response;
}

export function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};


