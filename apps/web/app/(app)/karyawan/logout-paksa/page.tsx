'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface LoggedInEmployee {
  id: string;
  nik: string;
  nama: string;
  last_activity: string;
  session_count: number;
}

export default function LogoutPaksaPage() {
  const [employees, setEmployees] = useState<LoggedInEmployee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLoggedInEmployees();
  }, [searchTerm]);

  const fetchLoggedInEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/karyawan/sessions?search=${searchTerm}`);
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleForceLogout = async (id: string) => {
    if (!confirm('Are you sure you want to force logout this employee?')) return;

    try {
      const response = await fetch(`/api/karyawan/sessions/${id}/logout`, {
        method: 'POST',
      });
      
      if (response.ok) {
        alert('Employee logged out successfully!');
        fetchLoggedInEmployees();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to logout employee');
    }
  };

  const handleLogoutAll = async () => {
    if (!confirm('Are you sure you want to logout ALL employees? This action cannot be undone.')) return;

    try {
      const response = await fetch('/api/karyawan/sessions/logout-all', {
        method: 'POST',
      });
      
      if (response.ok) {
        alert('All employees logged out successfully!');
        fetchLoggedInEmployees();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to logout all employees');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Logout Paksa</h1>
          <p className="text-muted-foreground">
            Force logout employees from the system
          </p>
        </div>
        <Button variant="destructive" onClick={handleLogoutAll}>
          Logout All
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>Currently logged-in employees</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search by NIK or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NIK</TableHead>
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead className="text-center">Active Sessions</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No active sessions found
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-mono">{employee.nik}</TableCell>
                      <TableCell className="font-medium">{employee.nama}</TableCell>
                      <TableCell>{new Date(employee.last_activity).toLocaleString('id-ID')}</TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {employee.session_count} session(s)
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleForceLogout(employee.id)}
                        >
                          Force Logout
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-900">⚠️ Warning</CardTitle>
        </CardHeader>
        <CardContent className="text-yellow-800">
          <p>Force logout will immediately end all sessions for the selected employee. Use this feature carefully as it may interrupt their work.</p>
        </CardContent>
      </Card>
    </div>
  );
}

