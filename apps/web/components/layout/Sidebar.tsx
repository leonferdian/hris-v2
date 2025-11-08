'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  Home,
  Database,
  UserPlus,
  Users,
  FileText,
  UserCheck,
  Calendar,
  CheckSquare,
  CreditCard,
  Star,
  BarChart,
  Settings,
  LogOut,
  Clock,
} from 'lucide-react';

interface MenuItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <Home className="w-5 h-5" />,
  },
  {
    label: 'Master',
    icon: <Database className="w-5 h-5" />,
    children: [
      { label: 'Master Bagian', href: '/master/bagian', icon: null },
      { label: 'Master Departemen', href: '/master/departemen', icon: null },
      { label: 'Master Divisi', href: '/master/divisi', icon: null },
      { label: 'Master Depo', href: '/master/depo', icon: null },
      { label: 'Master Hari Libur', href: '/master/hari-libur', icon: null },
      { label: 'Master Jabatan', href: '/master/jabatan', icon: null },
      { label: 'Master Jadwal Kerja', href: '/master/jadwal-kerja', icon: null },
      { label: 'Master Level', href: '/master/level', icon: null },
      { label: 'Master Periode', href: '/master/periode', icon: null },
      { label: 'Master Project', href: '/master/project', icon: null },
      { label: 'Master Seksi', href: '/master/seksi', icon: null },
      { label: 'Master Sub Bagian', href: '/master/sub-bagian', icon: null },
    ],
  },
  {
    label: 'Tambah Karyawan',
    icon: <UserPlus className="w-5 h-5" />,
    children: [
      { label: 'Data Karyawan', href: '/karyawan/data', icon: null },
      { label: 'Tambah Karyawan', href: '/karyawan/tambah', icon: null },
    ],
  },
  {
    label: 'Data Pelamar',
    icon: <FileText className="w-5 h-5" />,
    children: [
      { label: 'Data Pelamar', href: '/pelamar/data', icon: null },
      { label: 'Tambah Pelamar', href: '/pelamar/tambah', icon: null },
    ],
  },
  {
    label: 'Proses Rekrutmen',
    icon: <UserCheck className="w-5 h-5" />,
    children: [
      { label: 'Proses Rekrutmen', href: '/rekrutmen/proses', icon: null },
      { label: 'Hasil Rekrutmen', href: '/rekrutmen/hasil', icon: null },
    ],
  },
  {
    label: 'Karyawan',
    icon: <Users className="w-5 h-5" />,
    children: [
      { label: 'Data Karyawan', href: '/karyawan/list', icon: null },
      { label: 'Konfirmasi Data', href: '/karyawan/konfirmasi', icon: null },
      { label: 'Logout Paksa', href: '/karyawan/logout-paksa', icon: null },
    ],
  },
  {
    label: 'Absensi',
    icon: <Clock className="w-5 h-5" />,
    children: [
      { label: 'Absensi Biometric', href: '/absensi/biometric', icon: null },
      { label: 'Absensi Karyawan', href: '/absensi/karyawan', icon: null },
      { label: 'Absensi List', href: '/absensi/list', icon: null },
      { label: 'Absensi Shift', href: '/absensi/shift', icon: null },
      { label: 'Absensi Valid', href: '/absensi/valid', icon: null },
      { label: 'Tambah Manual', href: '/absensi/tambah-manual', icon: null },
    ],
  },
  {
    label: 'Konfirmasi Kehadiran',
    icon: <CheckSquare className="w-5 h-5" />,
    children: [
      { label: 'Konfirmasi Masuk', href: '/konfirmasi/masuk', icon: null },
      { label: 'Konfirmasi Pulang', href: '/konfirmasi/pulang', icon: null },
    ],
  },
  {
    label: 'Payroll',
    href: '/payroll',
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    label: 'Penilaian Karyawan',
    href: '/penilaian',
    icon: <Star className="w-5 h-5" />,
  },
  {
    label: 'Report',
    icon: <BarChart className="w-5 h-5" />,
    children: [
      { label: 'Report Absensi', href: '/report/absensi', icon: null },
      { label: 'Report Bitrix', href: '/report/bitrix', icon: null },
      { label: 'Report Cuti', href: '/report/cuti', icon: null },
    ],
  },
  {
    label: 'Administrator',
    icon: <Settings className="w-5 h-5" />,
    children: [
      { label: 'User Management', href: '/admin/users', icon: null },
      { label: 'Role Management', href: '/admin/roles', icon: null },
      { label: 'System Settings', href: '/admin/settings', icon: null },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set());

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <aside className="w-64 bg-slate-800 text-white min-h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-4 border-b border-slate-700">
        <h1 className="text-xl font-bold">HRIS System</h1>
        <p className="text-xs text-slate-400">Human Resource Information System</p>
      </div>

      <nav className="p-2">
        {menuItems.map((item) => {
          const hasChildren = item.children && item.children.length > 0;
          const isMenuOpen = openMenus.has(item.label);
          const isItemActive = item.href ? isActive(item.href) : false;

          return (
            <div key={item.label} className="mb-1">
              {hasChildren ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      'hover:bg-slate-700',
                      isMenuOpen && 'bg-slate-700'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 transition-transform',
                        isMenuOpen && 'rotate-180'
                      )}
                    />
                  </button>
                  {isMenuOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href!}
                          className={cn(
                            'block px-3 py-2 rounded-md text-sm transition-colors',
                            isActive(child.href!)
                              ? 'bg-blue-600 text-white'
                              : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href!}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isItemActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              )}
            </div>
          );
        })}

        <button
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors mt-4 border-t border-slate-700 pt-4"
          onClick={() => {
            // Handle logout
            window.location.href = '/api/auth/logout';
          }}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}

