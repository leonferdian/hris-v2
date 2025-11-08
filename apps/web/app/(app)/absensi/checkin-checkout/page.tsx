'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Upload, Search, Download } from 'lucide-react';

export default function CheckinCheckoutPage() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [depo, setDepo] = useState('all');
  const [attendanceType, setAttendanceType] = useState('1');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const handleView = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/absensi/checkin?date=${date}&depo=${depo}&type=${attendanceType}`);
      const result = await response.json();
      setData(result.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (!confirm('Sinkronisasi data absensi?')) return;
    setLoading(true);
    try {
      await fetch('/api/absensi/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, type: attendanceType })
      });
      alert('Data berhasil disinkronisasi');
      handleView();
    } catch (error) {
      console.error('Error syncing data:', error);
      alert('Gagal sinkronisasi data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Absensi Check-in Check-out</h1>
          <p className="text-muted-foreground">Kelola data absensi karyawan</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Depo</label>
              <Select value={depo} onValueChange={setDepo}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Depo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="jakarta">Jakarta</SelectItem>
                  <SelectItem value="bandung">Bandung</SelectItem>
                  <SelectItem value="surabaya">Surabaya</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tanggal</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Jenis Absensi</label>
              <Select value={attendanceType} onValueChange={setAttendanceType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Absensi Finger</SelectItem>
                  <SelectItem value="2">Absensi ILP</SelectItem>
                  <SelectItem value="3">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={handleView} disabled={loading}>
              <Search className="mr-2 h-4 w-4" />
              View
            </Button>
            <Button variant="outline" onClick={handleSync} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Sinkron Absensi
            </Button>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Upload Absensi
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Absensi</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIK</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Depo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check In</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check Out</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">{item.nik}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.nama}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.depo}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.check_in}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.check_out}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded ${
                          item.status === 'Hadir' ? 'bg-green-100 text-green-800' :
                          item.status === 'Terlambat' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Pilih filter dan klik View untuk menampilkan data
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

