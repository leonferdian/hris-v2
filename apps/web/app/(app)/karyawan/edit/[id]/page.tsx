'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function EditKaryawanPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nik: '',
    nama: '',
    email: '',
    telepon: '',
    alamat: '',
    tanggal_lahir: '',
    tempat_lahir: '',
    jenis_kelamin: 'L',
    status_pernikahan: 'Single',
    tanggal_masuk: '',
    jabatan_id: '',
    departemen_id: '',
    depo_id: '',
    status_karyawan: 'Kontrak',
    no_ktp: '',
    no_npwp: '',
    no_bpjs_kesehatan: '',
    no_bpjs_ketenagakerjaan: '',
  });

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      const response = await fetch(`/api/karyawan/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/karyawan/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        alert('Employee updated successfully!');
        router.push('/karyawan/list');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update employee');
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Karyawan</h1>
        <p className="text-muted-foreground">Update employee information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">NIK *</label>
                <Input
                  value={formData.nik}
                  onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name *</label>
                <Input
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={formData.telepon}
                  onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium">Address</label>
                <textarea
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  className="w-full rounded-md border border-input px-3 py-2"
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Join Date</label>
                <Input
                  type="date"
                  value={formData.tanggal_masuk}
                  onChange={(e) => setFormData({ ...formData, tanggal_masuk: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  value={formData.status_karyawan}
                  onChange={(e) => setFormData({ ...formData, status_karyawan: e.target.value })}
                  className="w-full rounded-md border border-input px-3 py-2"
                >
                  <option value="Kontrak">Contract</option>
                  <option value="Tetap">Permanent</option>
                  <option value="Probation">Probation</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button type="submit">Update</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

