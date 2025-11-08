import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyJwt } from '@/lib/jwt';

export default function HomePage() {
  const token = cookies().get('auth')?.value;
  const claims = verifyJwt(token);

  if (claims) {
    redirect('/dashboard');
  }

  redirect('/login');
}

