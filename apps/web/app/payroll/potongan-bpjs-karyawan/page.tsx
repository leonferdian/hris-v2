'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';

interface EmployeeBPJS {
  id: string;
  employeeNik: string;
  employeeName: string;
  bpjsKesehatanNumber: string;
  bpjsKesehatanAmount: number;
  bpjsKetenagakerjaanNumber: string;
  bpjsKetenagakerjaanAmount: number;
  totalDeduction: number;
  isActive: boolean;
}

export default function PotonganBPJSKaryawanPage() {
  const [employeeBPJS, setEmployeeBPJS] = useState<EmployeeBPJS[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    bpjsKesehatanNumber: '',
    bpjsKesehatanAmount: 0,
    bpjsKetenagakerjaanNumber: '',
    bpjsKetenagakerjaanAmount: 0,
  });

  useEffect(() => {
    fetchEmployeeBPJS();
  }, [searchTerm]);

  const fetchEmployeeBPJS = async () => {
    try {
      const response = await fetch(`/api/payroll/bpjs-deductions?search=${searchTerm}`);
      if (response.ok) {
        const data = await response.json();
        setEmployeeBPJS(data);
      }
    } catch (error) {
      console.error('Error fetching BPJS data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/payroll/bpjs-deductions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        alert('BPJS deduction saved successfully!');
        setShowForm(false);
        setFormData({
          employeeId: '',
          bpjsKesehatanNumber: '',
          bpjsKesehatanAmount: 0,
          bpjsKetenagakerjaanNumber: '',
          bpjsKetenagakerjaanAmount: 0,
        });
        fetchEmployeeBPJS();
      }
    } catch (error) {
      console.error('Error saving BPJS deduction:', error);
    }
  };

  const handleUploadBPJS = () => {
    // Trigger file upload
    alert('Upload BPJS functionality - Similar to Upload Insentif');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Potongan BPJS Karyawan</h1>
          <p className="text-muted-foreground">
            Manage employee BPJS deductions (Health & Employment)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleUploadBPJS}>
            Upload BPJS
          </Button>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add BPJS'}
          </Button>
        </div>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add BPJS Deduction</CardTitle>
            <CardDescription>Configure BPJS deductions for an employee</CardDescription>
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

              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">BPJS Kesehatan (Health Insurance)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">BPJS Kesehatan Number</label>
                    <Input
                      value={formData.bpjsKesehatanNumber}
                      onChange={(e) => setFormData({ ...formData, bpjsKesehatanNumber: e.target.value })}
                      placeholder="0000123456789"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Monthly Amount</label>
                    <Input
                      type="number"
                      value={formData.bpjsKesehatanAmount}
                      onChange={(e) => setFormData({ ...formData, bpjsKesehatanAmount: Number(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">BPJS Ketenagakerjaan (Employment Insurance)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">BPJS Ketenagakerjaan Number</label>
                    <Input
                      value={formData.bpjsKetenagakerjaanNumber}
                      onChange={(e) => setFormData({ ...formData, bpjsKetenagakerjaanNumber: e.target.value })}
                      placeholder="0000987654321"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Monthly Amount</label>
                    <Input
                      type="number"
                      value={formData.bpjsKetenagakerjaanAmount}
                      onChange={(e) => setFormData({ ...formData, bpjsKetenagakerjaanAmount: Number(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full">Save BPJS Deductions</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Employee BPJS Deductions</CardTitle>
          <CardDescription>List of employee BPJS deduction configurations</CardDescription>
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
                <TableHead>BPJS Kesehatan</TableHead>
                <TableHead className="text-right">Kesehatan Amount</TableHead>
                <TableHead>BPJS Ketenagakerjaan</TableHead>
                <TableHead className="text-right">Ketenagakerjaan Amount</TableHead>
                <TableHead className="text-right">Total Deduction</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employeeBPJS.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground">
                    No BPJS deduction records found
                  </TableCell>
                </TableRow>
              ) : (
                employeeBPJS.map((bpjs) => (
                  <TableRow key={bpjs.id}>
                    <TableCell className="font-mono">{bpjs.employeeNik}</TableCell>
                    <TableCell className="font-medium">{bpjs.employeeName}</TableCell>
                    <TableCell className="font-mono text-xs">{bpjs.bpjsKesehatanNumber}</TableCell>
                    <TableCell className="text-right">{formatCurrency(bpjs.bpjsKesehatanAmount)}</TableCell>
                    <TableCell className="font-mono text-xs">{bpjs.bpjsKetenagakerjaanNumber}</TableCell>
                    <TableCell className="text-right">{formatCurrency(bpjs.bpjsKetenagakerjaanAmount)}</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(bpjs.totalDeduction)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        bpjs.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {bpjs.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
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

