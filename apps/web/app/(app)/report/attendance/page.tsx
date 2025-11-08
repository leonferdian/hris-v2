'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileDown, Search } from 'lucide-react';

export default function AttendanceReportPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [depo, setDepo] = useState('all');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/report/attendance?startDate=${startDate}&endDate=${endDate}&depo=${depo}`
      );
      const result = await response.json();
      setData(result.data || []);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // Export logic here
    alert('Exporting to Excel...');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Laporan Absensi</h1>
          <p className="text-muted-foreground">Generate dan export laporan absensi</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Laporan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tanggal Mulai</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tanggal Selesai</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

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
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={handleGenerate} disabled={loading}>
              <Search className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
            <Button variant="outline" onClick={handleExport} disabled={data.length === 0}>
              <FileDown className="mr-2 h-4 w-4" />
              Export to Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Hasil Laporan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIK</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Depo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hadir</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Terlambat</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Izin</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alpha</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">{item.nik}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.nama}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.depo}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.hadir}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.terlambat}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.izin}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.alpha}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

