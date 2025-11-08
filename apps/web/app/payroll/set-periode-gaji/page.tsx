'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/utils';

interface PayrollPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  paymentDate: string;
  cutoffDate: string;
  status: 'draft' | 'active' | 'closed';
}

export default function SetPeriodeGajiPage() {
  const [periods, setPeriods] = useState<PayrollPeriod[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    paymentDate: '',
    cutoffDate: '',
  });

  useEffect(() => {
    fetchPeriods();
  }, []);

  const fetchPeriods = async () => {
    try {
      const response = await fetch('/api/payroll/periods');
      if (response.ok) {
        const data = await response.json();
        setPeriods(data);
      }
    } catch (error) {
      console.error('Error fetching periods:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/payroll/periods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        alert('Period saved successfully!');
        setShowForm(false);
        setFormData({ name: '', startDate: '', endDate: '', paymentDate: '', cutoffDate: '' });
        fetchPeriods();
      }
    } catch (error) {
      console.error('Error saving period:', error);
    }
  };

  const handleActivate = async (id: string) => {
    try {
      const response = await fetch(`/api/payroll/periods/${id}/activate`, {
        method: 'POST',
      });
      
      if (response.ok) {
        alert('Period activated!');
        fetchPeriods();
      }
    } catch (error) {
      console.error('Error activating period:', error);
    }
  };

  const handleClose = async (id: string) => {
    if (!confirm('Are you sure you want to close this period? This action cannot be undone.')) return;
    
    try {
      const response = await fetch(`/api/payroll/periods/${id}/close`, {
        method: 'POST',
      });
      
      if (response.ok) {
        alert('Period closed!');
        fetchPeriods();
      }
    } catch (error) {
      console.error('Error closing period:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Set Periode Gaji</h1>
          <p className="text-muted-foreground">
            Configure payroll periods and payment schedules
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Period'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Payroll Period</CardTitle>
            <CardDescription>Create a new payroll period</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Period Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., January 2025"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cutoff Date</label>
                  <Input
                    type="date"
                    value={formData.cutoffDate}
                    onChange={(e) => setFormData({ ...formData, cutoffDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Date</label>
                  <Input
                    type="date"
                    value={formData.paymentDate}
                    onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">Save Period</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Payroll Periods</CardTitle>
          <CardDescription>List of all payroll periods</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period Name</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Cutoff Date</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {periods.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No periods found
                  </TableCell>
                </TableRow>
              ) : (
                periods.map((period) => (
                  <TableRow key={period.id}>
                    <TableCell className="font-medium">{period.name}</TableCell>
                    <TableCell>{formatDate(period.startDate)}</TableCell>
                    <TableCell>{formatDate(period.endDate)}</TableCell>
                    <TableCell>{formatDate(period.cutoffDate)}</TableCell>
                    <TableCell>{formatDate(period.paymentDate)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        period.status === 'active' ? 'bg-green-100 text-green-800' :
                        period.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {period.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {period.status === 'draft' && (
                          <Button size="sm" onClick={() => handleActivate(period.id)}>
                            Activate
                          </Button>
                        )}
                        {period.status === 'active' && (
                          <Button size="sm" variant="destructive" onClick={() => handleClose(period.id)}>
                            Close
                          </Button>
                        )}
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

