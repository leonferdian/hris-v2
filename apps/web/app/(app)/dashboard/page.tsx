import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const dashboardStats = [
  {
    title: 'Total Karyawan',
    value: '0',
    description: 'Active employees',
    href: '/karyawan/list',
    icon: '👥',
    color: 'bg-blue-500',
  },
  {
    title: 'Hadir Hari Ini',
    value: '0',
    description: 'Present today',
    href: '/absensi/list',
    icon: '✓',
    color: 'bg-green-500',
  },
  {
    title: 'Cuti Pending',
    value: '0',
    description: 'Pending leave requests',
    href: '/report/cuti',
    icon: '📅',
    color: 'bg-yellow-500',
  },
  {
    title: 'Pelamar Baru',
    value: '0',
    description: 'New applicants',
    href: '/pelamar/data',
    icon: '📝',
    color: 'bg-purple-500',
  },
];

const quickActions = [
  {
    title: 'Tambah Karyawan',
    description: 'Add new employee to the system',
    href: '/karyawan/tambah',
    icon: '➕',
  },
  {
    title: 'Input Absensi',
    description: 'Manual attendance entry',
    href: '/absensi/tambah-manual',
    icon: '⏰',
  },
  {
    title: 'Proses Payroll',
    description: 'Generate monthly payroll',
    href: '/payroll/create-payroll',
    icon: '💰',
  },
  {
    title: 'Lihat Report',
    description: 'View attendance and payroll reports',
    href: '/report/absensi',
    icon: '📊',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to HRIS Management System
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.color} w-8 h-8 rounded-full flex items-center justify-center text-white text-lg`}>
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="text-4xl mb-2">{action.icon}</div>
                  <CardTitle className="text-base">{action.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {action.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates and activities in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground text-center py-8">
            No recent activities to display
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

