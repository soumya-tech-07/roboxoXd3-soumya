import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request) {
  try {
    if (!supabaseServiceKey) {
      console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not configured');
      return NextResponse.json(
        { error: 'Service configuration missing - SUPABASE_SERVICE_ROLE_KEY not set' },
        { status: 500 }
      );
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // Create admin client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // IMPORTANT: listUsers is paginated. We must paginate to be accurate.
    // We'll scan pages until we find the email or exhaust results.
    const perPage = 1000;
    const maxPages = 50; // hard cap to avoid runaway loops

    for (let page = 1; page <= maxPages; page += 1) {
      const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });

      if (error) {
        console.error('❌ Error listing users:', error);
        return NextResponse.json(
          { error: 'Failed to check email', details: error.message },
          { status: 500 }
        );
      }

      const users = data?.users || [];
      const exists = users.some((u) => u.email?.toLowerCase() === normalizedEmail);
      if (exists) return NextResponse.json({ exists: true }, { status: 200 });

      // No more users, stop early.
      if (users.length < perPage) break;
    }

    return NextResponse.json({ exists: false }, { status: 200 });
  } catch (error) {
    console.error('❌ Unexpected error in check-email:', error);
    return NextResponse.json(
      { error: 'Unexpected error', details: error.message },
      { status: 500 }
    );
  }
}

