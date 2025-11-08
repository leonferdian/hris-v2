'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CreatePayrollPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCreatePayroll = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/payroll/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period: selectedPeriod }),
      });
      
      if (response.ok) {
        alert('Payroll created successfully!');
      } else {
        alert('Failed to create payroll');
      }
    } catch (error) {
      console.error('Error creating payroll:', error);
      alert('Error creating payroll');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Payroll</h1>
        <p className="text-muted-foreground">
          Generate payroll for selected period
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payroll Generation</CardTitle>
          <CardDescription>
            Select a period and generate payroll for all employees
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Period</label>
            <Input
              type="month"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              placeholder="Select period"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Options</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Include overtime</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Include incentives</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Apply BPJS deductions</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Apply loan deductions</span>
              </label>
            </div>
          </div>

          <Button 
            onClick={handleCreatePayroll} 
            disabled={!selectedPeriod || isProcessing}
            className="w-full"
          >
            {isProcessing ? 'Processing...' : 'Generate Payroll'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Payroll</CardTitle>
          <CardDescription>Previously generated payrolls</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            No recent payrolls generated
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

