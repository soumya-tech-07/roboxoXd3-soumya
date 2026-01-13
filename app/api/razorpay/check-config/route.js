import { NextResponse } from 'next/server';

export async function GET(request) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 403 }
    );
  }

  return NextResponse.json({
    hasKeyId: !!process.env.RAZORPAY_KEY_ID,
    hasKeySecret: !!process.env.RAZORPAY_KEY_SECRET,
    keyIdPrefix: process.env.RAZORPAY_KEY_ID?.substring(0, 10) || 'not set',
    keySecretPrefix: process.env.RAZORPAY_KEY_SECRET?.substring(0, 10) || 'not set',
  });
}

