import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') || '/';

  if (!code) {
    return NextResponse.redirect(new URL(next, url.origin));
  }

  try {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(new URL(`/login?error=auth_callback`, url.origin));
  }

  return NextResponse.redirect(new URL(next, url.origin));
}

// git push