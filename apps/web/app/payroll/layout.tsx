import { Metadata } from 'next';
import PayrollNav from '@/components/payroll/PayrollNav';

export const metadata: Metadata = {
  title: 'Payroll | HRIS',
  description: 'Payroll management system',
};

export default function PayrollLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <PayrollNav />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}

