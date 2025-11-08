'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';

interface LateTolerance {
  id: string;
  name: string;
  minMinutes: number;
  maxMinutes: number;
  deductionType: 'fixed' | 'percentage';
  deductionAmount: number;
  isActive: boolean;
}

export default function MasterToleransiTerlambatPage() {
  const [tolerances, setTolerances] = useState<LateTolerance[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    minMinutes: 0,
    maxMinutes: 0,
    deductionType: 'fixed' as 'fixed' | 'percentage',
    deductionAmount: 0,
  });

  useEffect(() => {
    fetchTolerances();
  }, []);

  const fetchTolerances = async () => {
    try {
      const response = await fetch('/api/payroll/late-tolerances');
      if (response.ok) {
        const data = await response.json();
        setTolerances(data);
      }
    } catch (error) {
      console.error('Error fetching tolerances:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/payroll/late-tolerances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        alert('Tolerance rule saved successfully!');
        setShowForm(false);
        setFormData({
          name: '',
          minMinutes: 0,
          maxMinutes: 0,
          deductionType: 'fixed',
          deductionAmount: 0,
        });
        fetchTolerances();
      }
    } catch (error) {
      console.error('Error saving tolerance:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Master Toleransi Terlambat</h1>
          <p className="text-muted-foreground">
            Configure late arrival tolerance and deduction rules
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Rule'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Tolerance Rule</CardTitle>
            <CardDescription>Create a new late arrival tolerance rule</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Rule Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Late 1-15 minutes"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Min Minutes Late</label>
                  <Input
                    type="number"
                    value={formData.minMinutes}
                    onChange={(e) => setFormData({ ...formData, minMinutes: Number(e.target.value) })}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Minutes Late</label>
                  <Input
                    type="number"
                    value={formData.maxMinutes}
                    onChange={(e) => setFormData({ ...formData, maxMinutes: Number(e.target.value) })}
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Deduction Type</label>
                <select
                  value={formData.deductionType}
                  onChange={(e) => setFormData({ ...formData, deductionType: e.target.value as 'fixed' | 'percentage' })}
                  className="w-full rounded-md border border-input px-3 py-2"
                >
                  <option value="fixed">Fixed Amount</option>
                  <option value="percentage">Percentage of Daily Salary</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {formData.deductionType === 'fixed' ? 'Deduction Amount (IDR)' : 'Percentage (%)'}
                </label>
                <Input
                  type="number"
                  value={formData.deductionAmount}
                  onChange={(e) => setFormData({ ...formData, deductionAmount: Number(e.target.value) })}
                  placeholder="0"
                  required
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Preview:</strong> If an employee is late between {formData.minMinutes} and {formData.maxMinutes} minutes, 
                  they will be deducted {' '}
                  {formData.deductionType === 'fixed' 
                    ? formatCurrency(formData.deductionAmount)
                    : `${formData.deductionAmount}% of their daily salary`
                  }
                </p>
              </div>

              <Button type="submit" className="w-full">Save Rule</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Late Tolerance Rules</CardTitle>
          <CardDescription>List of late arrival tolerance rules and deductions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule Name</TableHead>
                <TableHead>Time Range (Minutes)</TableHead>
                <TableHead>Deduction Type</TableHead>
                <TableHead className="text-right">Deduction Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tolerances.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No tolerance rules found
                  </TableCell>
                </TableRow>
              ) : (
                tolerances.map((tolerance) => (
                  <TableRow key={tolerance.id}>
                    <TableCell className="font-medium">{tolerance.name}</TableCell>
                    <TableCell>{tolerance.minMinutes} - {tolerance.maxMinutes} minutes</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        tolerance.deductionType === 'fixed' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {tolerance.deductionType}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {tolerance.deductionType === 'fixed' 
                        ? formatCurrency(tolerance.deductionAmount)
                        : `${tolerance.deductionAmount}%`
                      }
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        tolerance.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {tolerance.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="destructive">Delete</Button>
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

