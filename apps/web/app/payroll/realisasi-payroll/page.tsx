'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/utils';

interface PayrollRealization {
  id: string;
  employeeId: string;
  employeeName: string;
  period: string;
  basicSalary: number;
  allowances: number;
  overtime: number;
  incentives: number;
  deductions: number;
  netSalary: number;
  status: 'pending' | 'approved' | 'paid';
}

export default function RealisasiPayrollPage() {
  const [payrolls, setPayrolls] = useState<PayrollRealization[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch payroll data
    fetchPayrollData();
  }, [selectedPeriod]);

  const fetchPayrollData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/payroll/realization?period=${selectedPeriod}`);
      if (response.ok) {
        const data = await response.json();
        setPayrolls(data);
      }
    } catch (error) {
      console.error('Error fetching payroll:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/payroll/realization/${id}/approve`, {
        method: 'POST',
      });
      if (response.ok) {
        fetchPayrollData();
        alert('Payroll approved successfully');
      }
    } catch (error) {
      console.error('Error approving payroll:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Realisasi Payroll</h1>
        <p className="text-muted-foreground">
          View and manage payroll realization
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payroll Realization</CardTitle>
          <CardDescription>
            Review and approve employee payroll
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="text-sm font-medium">Filter by Period</label>
            <input
              type="month"
              className="mt-1 block w-full rounded-md border border-input px-3 py-2"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : payrolls.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No payroll data found for selected period
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead className="text-right">Basic Salary</TableHead>
                  <TableHead className="text-right">Allowances</TableHead>
                  <TableHead className="text-right">Overtime</TableHead>
                  <TableHead className="text-right">Incentives</TableHead>
                  <TableHead className="text-right">Deductions</TableHead>
                  <TableHead className="text-right">Net Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrolls.map((payroll) => (
                  <TableRow key={payroll.id}>
                    <TableCell className="font-medium">{payroll.employeeName}</TableCell>
                    <TableCell>{payroll.period}</TableCell>
                    <TableCell className="text-right">{formatCurrency(payroll.basicSalary)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(payroll.allowances)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(payroll.overtime)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(payroll.incentives)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(payroll.deductions)}</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(payroll.netSalary)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        payroll.status === 'paid' ? 'bg-green-100 text-green-800' :
                        payroll.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payroll.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {payroll.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleApprove(payroll.id)}
                        >
                          Approve
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

