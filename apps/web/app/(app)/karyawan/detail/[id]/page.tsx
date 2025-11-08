'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface EmployeeDetail {
  id: string;
  nik: string;
  nama: string;
  email: string;
  telepon: string;
  alamat: string;
  tanggal_lahir: string;
  tempat_lahir: string;
  jenis_kelamin: string;
  agama: string;
  status_pernikahan: string;
  tanggal_masuk: string;
  jabatan: string;
  departemen: string;
  divisi: string;
  depo: string;
  status_karyawan: string;
  no_ktp: string;
  no_npwp: string;
  no_bpjs_kesehatan: string;
  no_bpjs_ketenagakerjaan: string;
}

export default function DetailKaryawanPage() {
  const params = useParams();
  const router = useRouter();
  const [employee, setEmployee] = useState<EmployeeDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployeeDetail();
  }, []);

  const fetchEmployeeDetail = async () => {
    try {
      const response = await fetch(`/api/karyawan/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setEmployee(data);
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!employee) {
    return <div className="p-6">Employee not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Detail</h1>
          <p className="text-muted-foreground">View employee information</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/karyawan/edit/${employee.id}`}>
            <Button>Edit</Button>
          </Link>
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
        </div>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">NIK</label>
              <p className="text-base font-mono">{employee.nik}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <p className="text-base font-semibold">{employee.nama}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-base">{employee.email || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Phone</label>
              <p className="text-base">{employee.telepon || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Birth Place/Date</label>
              <p className="text-base">{employee.tempat_lahir}, {new Date(employee.tanggal_lahir).toLocaleDateString('id-ID')}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Gender</label>
              <p className="text-base">{employee.jenis_kelamin === 'L' ? 'Male' : 'Female'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Religion</label>
              <p className="text-base">{employee.agama || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Marital Status</label>
              <p className="text-base">{employee.status_pernikahan}</p>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium text-muted-foreground">Address</label>
              <p className="text-base">{employee.alamat || '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employment Information */}
      <Card>
        <CardHeader>
          <CardTitle>Employment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Join Date</label>
              <p className="text-base">{new Date(employee.tanggal_masuk).toLocaleDateString('id-ID')}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Employment Status</label>
              <p className="text-base">{employee.status_karyawan}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Position</label>
              <p className="text-base font-medium">{employee.jabatan}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Department</label>
              <p className="text-base">{employee.departemen}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Division</label>
              <p className="text-base">{employee.divisi}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Depot</label>
              <p className="text-base">{employee.depo}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legal Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Legal Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">KTP Number</label>
              <p className="text-base font-mono">{employee.no_ktp || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">NPWP Number</label>
              <p className="text-base font-mono">{employee.no_npwp || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">BPJS Kesehatan</label>
              <p className="text-base font-mono">{employee.no_bpjs_kesehatan || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">BPJS Ketenagakerjaan</label>
              <p className="text-base font-mono">{employee.no_bpjs_ketenagakerjaan || '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

