'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Calendar } from 'lucide-react';

export default function PengajuanCutiPage() {
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    replacement: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/cuti/pengajuan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert('Pengajuan cuti berhasil disubmit');
        setFormData({ leaveType: '', startDate: '', endDate: '', reason: '', replacement: '' });
      }
    } catch (error) {
      console.error('Error submitting leave:', error);
      alert('Gagal submit pengajuan cuti');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Pengajuan Cuti</h1>
          <p className="text-muted-foreground">Ajukan permohonan cuti</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Pengajuan Cuti</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Jenis Cuti</label>
              <Select
                value={formData.leaveType}
                onValueChange={(value) => setFormData({ ...formData, leaveType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis cuti" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annual">Cuti Tahunan</SelectItem>
                  <SelectItem value="sick">Cuti Sakit</SelectItem>
                  <SelectItem value="marriage">Cuti Menikah</SelectItem>
                  <SelectItem value="maternity">Cuti Melahirkan</SelectItem>
                  <SelectItem value="other">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tanggal Mulai</label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tanggal Selesai</label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Alasan</label>
              <Textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Masukkan alasan pengajuan cuti"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Pengganti Sementara</label>
              <Input
                type="text"
                value={formData.replacement}
                onChange={(e) => setFormData({ ...formData, replacement: e.target.value })}
                placeholder="Nama pengganti (opsional)"
              />
            </div>

            <Button type="submit" className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Submit Pengajuan
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

