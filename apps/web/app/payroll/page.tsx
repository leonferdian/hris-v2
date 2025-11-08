import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const payrollModules = [
  {
    title: 'Create Payroll',
    description: 'Generate new payroll for employees',
    href: '/payroll/create-payroll',
    icon: '💰',
  },
  {
    title: 'Realisasi Payroll',
    description: 'View and manage payroll realization',
    href: '/payroll/realisasi-payroll',
    icon: '📊',
  },
  {
    title: 'Master Komponen Gaji',
    description: 'Manage salary components',
    href: '/payroll/master-komponen-gaji',
    icon: '🏗️',
  },
  {
    title: 'Master Skema Gaji',
    description: 'Configure salary schemes',
    href: '/payroll/master-skema-gaji',
    icon: '📋',
  },
  {
    title: 'Skema Gaji Karyawan',
    description: 'Manage employee salary schemes',
    href: '/payroll/skema-gaji-karyawan',
    icon: '👥',
  },
  {
    title: 'Set Periode Gaji',
    description: 'Configure payroll periods',
    href: '/payroll/set-periode-gaji',
    icon: '📅',
  },
  {
    title: 'Upload Insentif',
    description: 'Upload employee incentives',
    href: '/payroll/upload-insentif',
    icon: '📤',
  },
  {
    title: 'Potongan BPJS Karyawan',
    description: 'Manage BPJS deductions',
    href: '/payroll/potongan-bpjs-karyawan',
    icon: '🏥',
  },
  {
    title: 'Master Toleransi Terlambat',
    description: 'Configure late arrival tolerance',
    href: '/payroll/master-toleransi-terlambat',
    icon: '⏰',
  },
  {
    title: 'Report by Depo',
    description: 'View payroll reports by depot',
    href: '/payroll/report-by-depo',
    icon: '📈',
  },
];

export default function PayrollDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payroll Management</h1>
        <p className="text-muted-foreground">
          Manage payroll, salary schemes, and employee compensation
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {payrollModules.map((module) => (
          <Link key={module.href} href={module.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="text-4xl mb-2">{module.icon}</div>
                <CardTitle>{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

