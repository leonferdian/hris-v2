'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/utils';

interface EmployeeSalaryScheme {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNik: string;
  schemeId: string;
  schemeName: string;
  effectiveDate: string;
  basicSalary: number;
  totalAllowances: number;
  isActive: boolean;
}

export default function SkemaGajiKaryawanPage() {
  const [employeeSchemes, setEmployeeSchemes] = useState<EmployeeSalaryScheme[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    schemeId: '',
    effectiveDate: '',
  });

  useEffect(() => {
    fetchEmployeeSchemes();
  }, [searchTerm]);

  const fetchEmployeeSchemes = async () => {
    try {
      const response = await fetch(`/api/payroll/employee-schemes?search=${searchTerm}`);
      if (response.ok) {
        const data = await response.json();
        setEmployeeSchemes(data);
      }
    } catch (error) {
      console.error('Error fetching employee schemes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/payroll/employee-schemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        alert('Employee scheme assigned successfully!');
        setShowForm(false);
        setFormData({ employeeId: '', schemeId: '', effectiveDate: '' });
        fetchEmployeeSchemes();
      }
    } catch (error) {
      console.error('Error assigning scheme:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Skema Gaji Karyawan</h1>
          <p className="text-muted-foreground">
            Assign salary schemes to employees
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Assign Scheme'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Assign Salary Scheme</CardTitle>
            <CardDescription>Assign a salary scheme to an employee</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Employee</label>
                <select
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="w-full rounded-md border border-input px-3 py-2"
                  required
                >
                  <option value="">Select Employee</option>
                  {/* Employee options will be loaded from API */}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Salary Scheme</label>
                <select
                  value={formData.schemeId}
                  onChange={(e) => setFormData({ ...formData, schemeId: e.target.value })}
                  className="w-full rounded-md border border-input px-3 py-2"
                  required
                >
                  <option value="">Select Scheme</option>
                  {/* Scheme options will be loaded from API */}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Effective Date</label>
                <Input
                  type="date"
                  value={formData.effectiveDate}
                  onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full">Assign Scheme</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Employee Salary Schemes</CardTitle>
          <CardDescription>List of employee salary scheme assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search by employee name or NIK..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NIK</TableHead>
                <TableHead>Employee Name</TableHead>
                <TableHead>Scheme</TableHead>
                <TableHead>Effective Date</TableHead>
                <TableHead className="text-right">Basic Salary</TableHead>
                <TableHead className="text-right">Total Allowances</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employeeSchemes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No employee schemes found
                  </TableCell>
                </TableRow>
              ) : (
                employeeSchemes.map((scheme) => (
                  <TableRow key={scheme.id}>
                    <TableCell className="font-mono">{scheme.employeeNik}</TableCell>
                    <TableCell className="font-medium">{scheme.employeeName}</TableCell>
                    <TableCell>{scheme.schemeName}</TableCell>
                    <TableCell>{formatDate(scheme.effectiveDate)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(scheme.basicSalary)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(scheme.totalAllowances)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        scheme.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {scheme.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View</Button>
                        <Button size="sm" variant="outline">Edit</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

