'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye } from 'lucide-react';

export default function RecruitmentProcessPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    try {
      const url = statusFilter === 'all' 
        ? '/api/recruitment/process' 
        : `/api/recruitment/process?status=${statusFilter}`;
      const response = await fetch(url);
      const result = await response.json();
      setData(result.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    if (!confirm(`Update status ke ${newStatus}?`)) return;
    
    try {
      await fetch(`/api/recruitment/process/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      alert('Status berhasil diupdate');
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Gagal update status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Proses Rekrutmen</h1>
          <p className="text-muted-foreground">Kelola proses rekrutmen karyawan</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Status</CardTitle>
          <div className="mt-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="screening">Screening</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="test">Tes</SelectItem>
                <SelectItem value="medical">Medical Check-up</SelectItem>
                <SelectItem value="offering">Offering</SelectItem>
                <SelectItem value="onboarding">Onboarding</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posisi</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tahap</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{item.nama}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.posisi}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.tahap}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.tanggal}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded ${
                          item.status === 'Lulus' ? 'bg-green-100 text-green-800' :
                          item.status === 'Proses' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Select
                            defaultValue={item.status}
                            onValueChange={(value) => handleUpdateStatus(item.id, value)}
                          >
                            <SelectTrigger className="w-[140px] h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Proses">Proses</SelectItem>
                              <SelectItem value="Lulus">Lulus</SelectItem>
                              <SelectItem value="Tidak Lulus">Tidak Lulus</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Tidak ada data proses rekrutmen
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

