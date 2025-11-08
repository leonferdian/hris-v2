import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyJwt } from '@/lib/jwt';
import Link from 'next/link';

export default function AssistantPage() {
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
        <h1 style={{ marginTop: '1rem', fontSize: '2rem', fontWeight: 700 }}>AI Assistant</h1>
        <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
          Asisten AI untuk membantu analisis data HRIS
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
        <h2 style={{ marginTop: 0 }}>🤖 AI Assistant Integration</h2>
        <p style={{ color: '#6b7280', lineHeight: 1.6 }}>
          Fitur AI Assistant akan membantu Anda dalam:
        </p>
        <ul style={{ color: '#6b7280', lineHeight: 1.8 }}>
          <li>Menganalisis pola kehadiran karyawan</li>
          <li>Memberikan rekomendasi tindakan untuk keterlambatan berulang</li>
          <li>Menjawab pertanyaan terkait data absensi dan payroll</li>
          <li>Mengidentifikasi anomali dalam data kehadiran</li>
          <li>Membantu membuat laporan custom dengan bahasa natural</li>
        </ul>

        <div
          style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: '#f3f4f6',
            borderRadius: 8,
            borderLeft: '4px solid #2563eb',
          }}
        >
          <h3 style={{ marginTop: 0, fontSize: '1.1rem' }}>Planned Architecture</h3>
          <p style={{ color: '#6b7280', margin: '0.75rem 0', fontSize: '0.95rem' }}>
            <strong>LLM Service:</strong> Ollama (local) atau OpenAI-compatible API
          </p>
          <p style={{ color: '#6b7280', margin: '0.75rem 0', fontSize: '0.95rem' }}>
            <strong>Model:</strong> llama3 atau model custom fine-tuned dengan konteks HRIS
          </p>
          <p style={{ color: '#6b7280', margin: '0.75rem 0', fontSize: '0.95rem' }}>
            <strong>Integration:</strong> API endpoint <code>/api/assistant/chat</code> sudah tersedia
          </p>
        </div>

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
        </div>
      </section>

      <section
        style={{
          marginTop: '2rem',
          background: 'white',
          padding: '2rem',
          borderRadius: 12,
          boxShadow: '0 12px 35px rgba(15, 23, 42, 0.08)',
        }}
      >
        <h3 style={{ marginTop: 0 }}>Example Use Cases</h3>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {[
            {
              title: 'Analisis Keterlambatan',
              description: 'Tanyakan: "Siapa saja karyawan yang terlambat lebih dari 3 kali minggu ini?"',
            },
            {
              title: 'Tren Kehadiran',
              description: 'Tanyakan: "Bagaimana tren kehadiran di depo Sidoarjo bulan ini?"',
            },
            {
              title: 'Rekomendasi Aksi',
              description: 'Tanyakan: "Apa yang harus dilakukan untuk karyawan dengan absen kurang dari 80%?"',
            },
          ].map((useCase, idx) => (
            <div
              key={idx}
              style={{
                padding: '1.25rem',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
              }}
            >
              <h4 style={{ marginTop: 0, fontSize: '1rem' }}>{useCase.title}</h4>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>{useCase.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}


