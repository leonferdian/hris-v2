'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';

interface SalaryScheme {
  id: string;
  code: string;
  name: string;
  basicSalary: number;
  components: {
    componentId: string;
    componentName: string;
    amount: number;
  }[];
  isActive: boolean;
}

export default function MasterSkemaGajiPage() {
  const [schemes, setSchemes] = useState<SalaryScheme[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    basicSalary: 0,
  });

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      const response = await fetch('/api/payroll/salary-schemes');
      if (response.ok) {
        const data = await response.json();
        setSchemes(data);
      }
    } catch (error) {
      console.error('Error fetching schemes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/payroll/salary-schemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        alert('Scheme saved successfully!');
        setShowForm(false);
        setFormData({ code: '', name: '', basicSalary: 0 });
        fetchSchemes();
      }
    } catch (error) {
      console.error('Error saving scheme:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Master Skema Gaji</h1>
          <p className="text-muted-foreground">
            Configure salary schemes with components
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Scheme'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Salary Scheme</CardTitle>
            <CardDescription>Create a new salary scheme template</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Code</label>
                  <Input
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g., STF-01"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Staff Level 1"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Basic Salary</label>
                <Input
                  type="number"
                  value={formData.basicSalary}
                  onChange={(e) => setFormData({ ...formData, basicSalary: Number(e.target.value) })}
                  placeholder="0"
                  required
                />
              </div>

              <Button type="submit" className="w-full">Save Scheme</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Salary Schemes</CardTitle>
          <CardDescription>List of all salary scheme templates</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Basic Salary</TableHead>
                <TableHead className="text-center">Components</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schemes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No schemes found
                  </TableCell>
                </TableRow>
              ) : (
                schemes.map((scheme) => (
                  <TableRow key={scheme.id}>
                    <TableCell className="font-mono">{scheme.code}</TableCell>
                    <TableCell className="font-medium">{scheme.name}</TableCell>
                    <TableCell className="text-right">{formatCurrency(scheme.basicSalary)}</TableCell>
                    <TableCell className="text-center">{scheme.components.length}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        scheme.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {scheme.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="outline">Components</Button>
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

