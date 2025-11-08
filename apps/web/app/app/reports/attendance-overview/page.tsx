import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyJwt } from '@/lib/jwt';
import Link from 'next/link';

export default function AttendanceOverviewPage() {
  const token = cookies().get('auth')?.value;
  const claims = verifyJwt(token);

  if (!claims) {
    redirect('/login');
  }

  return (
    <main style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link
          href="/dashboard"
          style={{
            color: '#2563eb',
            textDecoration: 'none',
            fontSize: '0.95rem',
            fontWeight: 600,
          }}
        >
          ← Kembali ke Dashboard
        </Link>
        <h1 style={{ marginTop: '1rem', fontSize: '2rem', fontWeight: 700 }}>Attendance Overview</h1>
        <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
          Laporan kehadiran modern - dalam pengembangan
        </p>
      </header>

      <section
        style={{
          background: 'white',
          padding: '2rem',
          borderRadius: 12,
          boxShadow: '0 12px 35px rgba(15, 23, 42, 0.08)',
        }}
      >
        <h2 style={{ marginTop: 0 }}>🚧 Coming Soon</h2>
        <p style={{ color: '#6b7280', lineHeight: 1.6 }}>
          Halaman ini sedang dalam tahap pengembangan. Dashboard attendance overview yang modern akan segera hadir dengan fitur:
        </p>
        <ul style={{ color: '#6b7280', lineHeight: 1.8 }}>
          <li>Ringkasan kehadiran real-time</li>
          <li>Grafik dan visualisasi interaktif</li>
          <li>Filter berdasarkan departemen, depo, dan periode</li>
          <li>Export data ke Excel/PDF</li>
          <li>Integrasi dengan AI assistant untuk insights</li>
        </ul>
        <p style={{ color: '#6b7280', marginTop: '1.5rem' }}>
          Sementara itu, Anda dapat menggunakan aplikasi legacy melalui dashboard.
        </p>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
          <Link
            href="/dashboard"
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: 8,
              backgroundColor: '#2563eb',
              color: 'white',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Kembali ke Dashboard
          </Link>
          <a
            href="http://localhost/_hris/absensi"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: 8,
              border: '1px solid #d1d5db',
              textDecoration: 'none',
              color: '#111827',
              fontWeight: 600,
            }}
          >
            Buka Legacy Absensi
          </a>
        </div>
      </section>
    </main>
  );
}


