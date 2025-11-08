'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TambahKaryawanPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nik: '',
    nama: '',
    email: '',
    telepon: '',
    alamat: '',
    tanggal_lahir: '',
    tempat_lahir: '',
    jenis_kelamin: 'L',
    agama: '',
    status_pernikahan: 'Single',
    tanggal_masuk: '',
    jabatan_id: '',
    departemen_id: '',
    divisi_id: '',
    bagian_id: '',
    depo_id: '',
    level_id: '',
    status_karyawan: 'Kontrak',
    no_ktp: '',
    no_npwp: '',
    no_bpjs_kesehatan: '',
    no_bpjs_ketenagakerjaan: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/karyawan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        alert('Employee added successfully!');
        router.push('/karyawan/list');
      } else {
        alert('Failed to add employee');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add employee');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tambah Karyawan</h1>
        <p className="text-muted-foreground">Add new employee to the system</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Basic employee information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">NIK *</label>
                <Input
                  value={formData.nik}
                  onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                  placeholder="Employee NIK"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name *</label>
                <Input
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={formData.telepon}
                  onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                  placeholder="Phone number"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Birth Place</label>
                <Input
                  value={formData.tempat_lahir}
                  onChange={(e) => setFormData({ ...formData, tempat_lahir: e.target.value })}
                  placeholder="Birth place"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Birth Date</label>
                <Input
                  type="date"
                  value={formData.tanggal_lahir}
                  onChange={(e) => setFormData({ ...formData, tanggal_lahir: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Gender</label>
                <select
                  value={formData.jenis_kelamin}
                  onChange={(e) => setFormData({ ...formData, jenis_kelamin: e.target.value })}
                  className="w-full rounded-md border border-input px-3 py-2"
                >
                  <option value="L">Male</option>
                  <option value="P">Female</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Marital Status</label>
                <select
                  value={formData.status_pernikahan}
                  onChange={(e) => setFormData({ ...formData, status_pernikahan: e.target.value })}
                  className="w-full rounded-md border border-input px-3 py-2"
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                </select>
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium">Address</label>
                <textarea
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  className="w-full rounded-md border border-input px-3 py-2"
                  rows={3}
                  placeholder="Full address"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employment Information */}
        <Card>
          <CardHeader>
            <CardTitle>Employment Information</CardTitle>
            <CardDescription>Position and department details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Join Date *</label>
                <Input
                  type="date"
                  value={formData.tanggal_masuk}
                  onChange={(e) => setFormData({ ...formData, tanggal_masuk: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Employment Status</label>
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
              <div className="space-y-2">
                <label className="text-sm font-medium">Position</label>
                <Input
                  value={formData.jabatan_id}
                  onChange={(e) => setFormData({ ...formData, jabatan_id: e.target.value })}
                  placeholder="Select position"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <Input
                  value={formData.departemen_id}
                  onChange={(e) => setFormData({ ...formData, departemen_id: e.target.value })}
                  placeholder="Select department"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Division</label>
                <Input
                  value={formData.divisi_id}
                  onChange={(e) => setFormData({ ...formData, divisi_id: e.target.value })}
                  placeholder="Select division"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Depot</label>
                <Input
                  value={formData.depo_id}
                  onChange={(e) => setFormData({ ...formData, depo_id: e.target.value })}
                  placeholder="Select depot"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legal Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Legal Documents</CardTitle>
            <CardDescription>ID numbers and tax information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">KTP Number</label>
                <Input
                  value={formData.no_ktp}
                  onChange={(e) => setFormData({ ...formData, no_ktp: e.target.value })}
                  placeholder="KTP number"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">NPWP Number</label>
                <Input
                  value={formData.no_npwp}
                  onChange={(e) => setFormData({ ...formData, no_npwp: e.target.value })}
                  placeholder="NPWP number"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">BPJS Kesehatan</label>
                <Input
                  value={formData.no_bpjs_kesehatan}
                  onChange={(e) => setFormData({ ...formData, no_bpjs_kesehatan: e.target.value })}
                  placeholder="BPJS Kesehatan number"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">BPJS Ketenagakerjaan</label>
                <Input
                  value={formData.no_bpjs_ketenagakerjaan}
                  onChange={(e) => setFormData({ ...formData, no_bpjs_ketenagakerjaan: e.target.value })}
                  placeholder="BPJS Ketenagakerjaan number"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex gap-2">
          <Button type="submit" className="w-32">Save</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

