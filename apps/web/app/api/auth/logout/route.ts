import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({ name: 'auth', value: '', path: '/', maxAge: 0, httpOnly: true, sameSite: 'lax' });
  return response;
}

