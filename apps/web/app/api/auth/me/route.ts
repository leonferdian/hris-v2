import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/jwt';

export async function GET() {
  const token = cookies().get('auth')?.value;
  const claims = verifyJwt(token);

  if (!claims) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true, user: claims });
}

