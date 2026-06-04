import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ action: string }> }
) {
  try {
    const { action } = await params;
    const body = await request.json();

    // Map the Next.js API actions to Express backend routes
    let backendEndpoint = '';
    if (action === 'login') backendEndpoint = '/api/auth/login';
    else if (action === 'register') backendEndpoint = '/api/auth/register';
    else if (action === 'verify-otp') backendEndpoint = '/api/auth/verify-otp';
    else if (action === 'google') backendEndpoint = '/api/auth/google';
    else {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }

    const response = await fetch(`${BACKEND_URL}${backendEndpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error || 'Request failed' }, { status: response.status });
    }

    const nextResponse = NextResponse.json(data);

    // If the response contains a token, set it as an httpOnly cookie
    if (data.token) {
      const cookieStore = await cookies();
      cookieStore.set({
        name: 'token',
        value: data.token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    }

    return nextResponse;
  } catch (error: any) {
    console.error('Error in Next.js API Route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
