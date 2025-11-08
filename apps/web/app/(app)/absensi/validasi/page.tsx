'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Check, X, Upload } from 'lucide-react';

export default function ValidasiAbsensiPage() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [depo, setDepo] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const handleView = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/absensi/validasi?date=${date}&depo=${depo}`);
      const result = await response.json();
      setData(result.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (item: any, isApproved: boolean) => {
    if (!confirm(`${isApproved ? 'Approve' : 'Reject'} validasi ini?`)) return;
    
    try {
      await fetch('/api/absensi/validasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          depo: item.depo,
          pin: item.pin,
          nik: item.nik,
          date: item.date_absen,
          isApproved
        })
      });
      alert('Validasi berhasil disimpan');
      handleView();
    } catch (error) {
      console.error('Error validating:', error);
      alert('Gagal menyimpan validasi');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Validasi Absensi</h1>
          <p className="text-muted-foreground">Validasi data absensi karyawan</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Depo</label>
              <Select value={depo} onValueChange={setDepo}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Depo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
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
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={handleView} disabled={loading}>
              <Search className="mr-2 h-4 w-4" />
              View
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
          <CardTitle>Data Validasi</CardTitle>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keterangan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">{item.nik}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.nama}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.depo}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.date_absen}</td>
                      <td className="px-6 py-4">{item.keterangan || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleValidate(item, true)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleValidate(item, false)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
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

