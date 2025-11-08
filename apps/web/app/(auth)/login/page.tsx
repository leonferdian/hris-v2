'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? 'Login failed');
      }

      router.replace('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: 360,
          backgroundColor: 'white',
          padding: '2.5rem',
          borderRadius: 12,
          boxShadow: '0 20px 45px rgba(15, 23, 42, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>HRIS Remaster</h1>
          <p style={{ marginTop: 8, color: '#6b7280' }}>Masuk dengan kredensial HRIS lama Anda.</p>
        </div>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', color: '#4b5563' }}>Username</span>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="username"
            autoComplete="username"
            required
            style={{
              borderRadius: 8,
              border: '1px solid #d1d5db',
              padding: '0.75rem 1rem',
              fontSize: '1rem',
            }}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', color: '#4b5563' }}>Password</span>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="password"
            autoComplete="current-password"
            required
            style={{
              borderRadius: 8,
              border: '1px solid #d1d5db',
              padding: '0.75rem 1rem',
              fontSize: '1rem',
            }}
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: '0.5rem',
            borderRadius: 8,
            border: 'none',
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
        {error ? (
          <p style={{ color: '#b91c1c', fontSize: '0.95rem' }}>{error}</p>
        ) : null}
        <p style={{ fontSize: '0.8rem', color: '#9ca3af', textAlign: 'center' }}>
          Kredensial diverifikasi terhadap database HRIS lama tanpa mengubah password.
        </p>
      </form>
    </div>
  );
}

