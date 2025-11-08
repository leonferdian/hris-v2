'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';

interface IncentiveUpload {
  employeeNik: string;
  employeeName: string;
  amount: number;
  status: 'success' | 'error';
  message?: string;
}

export default function UploadInsentifPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResults, setUploadResults] = useState<IncentiveUpload[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedPeriod) {
      alert('Please select a file and period');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('period', selectedPeriod);

    try {
      const response = await fetch('/api/payroll/upload-incentives', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadResults(data.results);
        alert('Upload completed!');
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    // Create a sample CSV template
    const csvContent = 'NIK,Employee Name,Incentive Amount\n' +
                       'EMP001,John Doe,1000000\n' +
                       'EMP002,Jane Smith,1500000\n';
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'incentive_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Insentif</h1>
        <p className="text-muted-foreground">
          Upload employee incentives from Excel/CSV file
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Incentive File</CardTitle>
          <CardDescription>
            Upload an Excel or CSV file containing employee incentives
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
            <label className="text-sm font-medium">File</label>
            <div className="flex gap-2">
              <Input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
              />
              <Button variant="outline" onClick={downloadTemplate}>
                Download Template
              </Button>
            </div>
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Selected file: {selectedFile.name}
              </p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">File Format Guidelines:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• File must contain columns: NIK, Employee Name, Incentive Amount</li>
              <li>• Use Excel (.xlsx, .xls) or CSV format</li>
              <li>• Ensure NIK matches employee records</li>
              <li>• Amount should be numeric without currency symbols</li>
            </ul>
          </div>

          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || !selectedPeriod || isUploading}
            className="w-full"
          >
            {isUploading ? 'Uploading...' : 'Upload Incentives'}
          </Button>
        </CardContent>
      </Card>

      {uploadResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Results</CardTitle>
            <CardDescription>
              {uploadResults.filter(r => r.status === 'success').length} successful, {' '}
              {uploadResults.filter(r => r.status === 'error').length} failed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NIK</TableHead>
                  <TableHead>Employee Name</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uploadResults.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono">{result.employeeNik}</TableCell>
                    <TableCell>{result.employeeName}</TableCell>
                    <TableCell className="text-right">{formatCurrency(result.amount)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        result.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {result.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {result.message || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

