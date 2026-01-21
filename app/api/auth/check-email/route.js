import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request) {
  try {
    // Log for debugging
    console.log('🔍 Checking email endpoint called');
    console.log('Service key configured:', !!supabaseServiceKey);
    console.log('Supabase URL:', supabaseUrl);

    if (!supabaseServiceKey) {
      console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not configured');
      return NextResponse.json(
        { error: 'Service configuration missing - SUPABASE_SERVICE_ROLE_KEY not set' },
        { status: 500 }
      );
    }

    const { email } = await request.json();
    console.log('Email to check:', email);

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Create admin client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Check if user exists using admin API
    console.log('🔍 Querying auth.users for email:', email.toLowerCase());
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error('❌ Error listing users:', error);
      return NextResponse.json(
        { error: 'Failed to check email', details: error.message },
        { status: 500 }
      );
    }

    // Check if any user has this email
    const exists = data.users.some(
      user => user.email?.toLowerCase() === email.toLowerCase()
    );

    console.log('✅ Email exists:', exists);
    console.log('Total users found:', data.users.length);

    return NextResponse.json({ exists }, { status: 200 });
  } catch (error) {
    console.error('❌ Unexpected error in check-email:', error);
    return NextResponse.json(
      { error: 'Unexpected error', details: error.message },
      { status: 500 }
    );
  }
}

