import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || 'pwned@example.com');

  return NextResponse.json({
    success: true,
    message: `Email changed (simulated) to ${email} without any CSRF protection.`,
    flag: 'flag{csrf_protected}',
  });
}

