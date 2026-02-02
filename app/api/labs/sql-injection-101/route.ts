import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { username = '', password = '' } = await request.json();

  const unsafeQuery = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;

  const normalizedUsername = String(username).toLowerCase();
  const injectionDetected =
    normalizedUsername.includes("admin' or '1'='1") ||
    normalizedUsername.includes(`' or '1'='1`) ||
    normalizedUsername.includes('" or "1"="1');

  const isLegitLogin =
    String(username) === 'admin' && String(password) === 'password123';

  const success = isLegitLogin || injectionDetected;

  if (!success) {
    return NextResponse.json({
      success: false,
      message: 'Login failed. Invalid credentials.',
      debugQuery: unsafeQuery,
    });
  }

  return NextResponse.json({
    success: true,
    message: injectionDetected
      ? 'Login bypassed via SQL injection!'
      : 'Login successful with correct credentials.',
    flag: 'flag{sql_inj3ct1on}',
    debugQuery: unsafeQuery,
  });
}

