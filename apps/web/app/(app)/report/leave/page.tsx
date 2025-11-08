'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileDown, Search } from 'lucide-react';

export default function LeaveReportPage() {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/report/leave?year=${year}&month=${month}`);
      const result = await response.json();
      setData(result.data || []);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    alert('Exporting to Excel...');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Laporan Cuti</h1>
          <p className="text-muted-foreground">Generate dan export laporan cuti karyawan</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Laporan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tahun</label>
              <Input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min="2020"
                max="2030"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bulan (Opsional)</label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Bulan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Semua</SelectItem>
                  <SelectItem value="01">Januari</SelectItem>
                  <SelectItem value="02">Februari</SelectItem>
                  <SelectItem value="03">Maret</SelectItem>
                  <SelectItem value="04">April</SelectItem>
                  <SelectItem value="05">Mei</SelectItem>
                  <SelectItem value="06">Juni</SelectItem>
                  <SelectItem value="07">Juli</SelectItem>
                  <SelectItem value="08">Agustus</SelectItem>
                  <SelectItem value="09">September</SelectItem>
                  <SelectItem value="10">Oktober</SelectItem>
                  <SelectItem value="11">November</SelectItem>
                  <SelectItem value="12">Desember</SelectItem>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenis Cuti</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durasi</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">{item.nik}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.nama}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.jenis_cuti}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.tanggal}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.durasi} hari</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded ${
                          item.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}

