'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface SalaryComponent {
  id: string;
  code: string;
  name: string;
  type: 'allowance' | 'deduction';
  isActive: boolean;
  description?: string;
}

export default function MasterKomponenGajiPage() {
  const [components, setComponents] = useState<SalaryComponent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'allowance' as 'allowance' | 'deduction',
    description: '',
  });

  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    try {
      const response = await fetch('/api/payroll/salary-components');
      if (response.ok) {
        const data = await response.json();
        setComponents(data);
      }
    } catch (error) {
      console.error('Error fetching components:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/payroll/salary-components', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        alert('Component saved successfully!');
        setShowForm(false);
        setFormData({ code: '', name: '', type: 'allowance', description: '' });
        fetchComponents();
      }
    } catch (error) {
      console.error('Error saving component:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this component?')) return;
    
    try {
      const response = await fetch(`/api/payroll/salary-components/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        alert('Component deleted successfully!');
        fetchComponents();
      }
    } catch (error) {
      console.error('Error deleting component:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Master Komponen Gaji</h1>
          <p className="text-muted-foreground">
            Manage salary components (allowances and deductions)
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Component'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Component</CardTitle>
            <CardDescription>Create a new salary component</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Code</label>
                  <Input
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g., TRP (Tunjangan Transportasi)"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Component name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'allowance' | 'deduction' })}
                  className="w-full rounded-md border border-input px-3 py-2"
                >
                  <option value="allowance">Allowance (Tunjangan)</option>
                  <option value="deduction">Deduction (Potongan)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-md border border-input px-3 py-2"
                  rows={3}
                  placeholder="Optional description"
                />
              </div>

              <Button type="submit" className="w-full">Save Component</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Salary Components</CardTitle>
          <CardDescription>List of all salary components</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {components.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No components found
                  </TableCell>
                </TableRow>
              ) : (
                components.map((component) => (
                  <TableRow key={component.id}>
                    <TableCell className="font-mono">{component.code}</TableCell>
                    <TableCell className="font-medium">{component.name}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        component.type === 'allowance' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {component.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{component.description || '-'}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        component.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {component.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(component.id)}>
                          Delete
                        </Button>
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

