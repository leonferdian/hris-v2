'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface PendingConfirmation {
  id: string;
  nik: string;
  nama: string;
  type: string;
  data: any;
  requested_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function KonfirmasiDataPage() {
  const [confirmations, setConfirmations] = useState<PendingConfirmation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchConfirmations();
  }, []);

  const fetchConfirmations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/karyawan/konfirmasi');
      if (response.ok) {
        const data = await response.json();
        setConfirmations(data);
      }
    } catch (error) {
      console.error('Error fetching confirmations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/karyawan/konfirmasi/${id}/approve`, {
        method: 'POST',
      });
      
      if (response.ok) {
        alert('Confirmed successfully!');
        fetchConfirmations();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to confirm');
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`/api/karyawan/konfirmasi/${id}/reject`, {
        method: 'POST',
      });
      
      if (response.ok) {
        alert('Rejected successfully!');
        fetchConfirmations();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to reject');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Konfirmasi Data Karyawan</h1>
        <p className="text-muted-foreground">
          Review and approve employee data change requests
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Confirmations</CardTitle>
          <CardDescription>Employee data updates awaiting approval</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NIK</TableHead>
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Change Type</TableHead>
                  <TableHead>Requested At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {confirmations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No pending confirmations
                    </TableCell>
                  </TableRow>
                ) : (
                  confirmations.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono">{item.nik}</TableCell>
                      <TableCell className="font-medium">{item.nama}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{new Date(item.requested_at).toLocaleString('id-ID')}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : item.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {item.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleApprove(item.id)}>
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(item.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

