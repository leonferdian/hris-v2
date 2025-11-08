'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';

interface DepoReport {
  depoId: string;
  depoName: string;
  depoLocation: string;
  employeeCount: number;
  totalBasicSalary: number;
  totalAllowances: number;
  totalDeductions: number;
  netPayroll: number;
}

export default function ReportByDepoPage() {
  const [reports, setReports] = useState<DepoReport[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPeriod) {
      fetchReports();
    }
  }, [selectedPeriod]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/payroll/reports/by-depo?period=${selectedPeriod}`);
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // Trigger export to Excel
    alert('Export to Excel functionality');
  };

  const calculateTotals = () => {
    return reports.reduce(
      (acc, report) => ({
        employeeCount: acc.employeeCount + report.employeeCount,
        totalBasicSalary: acc.totalBasicSalary + report.totalBasicSalary,
        totalAllowances: acc.totalAllowances + report.totalAllowances,
        totalDeductions: acc.totalDeductions + report.totalDeductions,
        netPayroll: acc.netPayroll + report.netPayroll,
      }),
      {
        employeeCount: 0,
        totalBasicSalary: 0,
        totalAllowances: 0,
        totalDeductions: 0,
        netPayroll: 0,
      }
    );
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Report by Depo</h1>
        <p className="text-muted-foreground">
          View payroll reports grouped by depot/location
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payroll Report by Depot</CardTitle>
          <CardDescription>
            Summary of payroll expenses by depot location
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Select Period</label>
              <Input
                type="month"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleExport} variant="outline" disabled={reports.length === 0}>
                Export to Excel
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading reports...</div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {selectedPeriod ? 'No data found for selected period' : 'Please select a period'}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Depo Code</TableHead>
                    <TableHead>Depo Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-center">Employees</TableHead>
                    <TableHead className="text-right">Basic Salary</TableHead>
                    <TableHead className="text-right">Allowances</TableHead>
                    <TableHead className="text-right">Deductions</TableHead>
                    <TableHead className="text-right">Net Payroll</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.depoId}>
                      <TableCell className="font-mono">{report.depoId}</TableCell>
                      <TableCell className="font-medium">{report.depoName}</TableCell>
                      <TableCell>{report.depoLocation}</TableCell>
                      <TableCell className="text-center">{report.employeeCount}</TableCell>
                      <TableCell className="text-right">{formatCurrency(report.totalBasicSalary)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(report.totalAllowances)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(report.totalDeductions)}</TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(report.netPayroll)}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">View Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-gray-50 font-bold">
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-center">{totals.employeeCount}</TableCell>
                    <TableCell className="text-right">{formatCurrency(totals.totalBasicSalary)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(totals.totalAllowances)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(totals.totalDeductions)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(totals.netPayroll)}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="mt-6 grid grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total Depots</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{reports.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total Employees</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totals.employeeCount}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total Allowances</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(totals.totalAllowances)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Net Payroll</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(totals.netPayroll)}</div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

