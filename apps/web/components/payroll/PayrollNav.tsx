'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', href: '/payroll' },
  { label: 'Create Payroll', href: '/payroll/create-payroll' },
  { label: 'Realisasi Payroll', href: '/payroll/realisasi-payroll' },
  { label: 'Master Komponen Gaji', href: '/payroll/master-komponen-gaji' },
  { label: 'Master Skema Gaji', href: '/payroll/master-skema-gaji' },
  { label: 'Skema Gaji Karyawan', href: '/payroll/skema-gaji-karyawan' },
  { label: 'Set Periode Gaji', href: '/payroll/set-periode-gaji' },
  { label: 'Upload Insentif', href: '/payroll/upload-insentif' },
  { label: 'Potongan BPJS', href: '/payroll/potongan-bpjs-karyawan' },
  { label: 'Toleransi Terlambat', href: '/payroll/master-toleransi-terlambat' },
  { label: 'Report by Depo', href: '/payroll/report-by-depo' },
];

export default function PayrollNav() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4">
      <div className="mb-6">
        <Link href="/payroll">
          <h2 className="text-xl font-bold text-primary">Payroll System</h2>
        </Link>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'block px-3 py-2 rounded-md text-sm font-medium transition-colors',
              pathname === item.href
                ? 'bg-primary text-primary-foreground'
                : 'text-gray-700 hover:bg-gray-100'
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

