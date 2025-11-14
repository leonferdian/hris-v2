import { NextResponse } from 'next/server';
import { syncAbsensi, AttendanceType } from '@/lib/services/absensi';

interface SyncPayload {
  date?: string;
  type?: AttendanceType;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as SyncPayload;
    const date = body.date;
    const type = body.type ?? '1';

    if (!date) {
      return NextResponse.json(
        { error: 'Tanggal wajib diisi' },
        { status: 400 },
      );
    }

    if (!['1', '2', '3'].includes(type)) {
      return NextResponse.json(
        { error: 'Jenis absensi tidak valid' },
        { status: 400 },
      );
    }

    const result = await syncAbsensi(date, type);

    return NextResponse.json({
      success: true,
      message: 'Data absensi berhasil disinkronisasi',
      details: result,
    });
  } catch (error: any) {
    console.error('Sync absensi failed:', error);
    return NextResponse.json(
      { error: error?.message ?? 'Gagal sinkronisasi data absensi' },
      { status: 500 },
    );
  }
}

