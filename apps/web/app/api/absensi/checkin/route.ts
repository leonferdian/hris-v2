import { NextResponse } from 'next/server';
import {
  AttendanceType,
  deriveAttendanceStatus,
  fetchAttendanceCheckin,
} from '@/lib/services/absensi';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const date = searchParams.get('date') ?? undefined;
    const depo = searchParams.get('depo') ?? undefined;
    const type = (searchParams.get('type') ?? '1') as AttendanceType;

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

    const records = await fetchAttendanceCheckin(date, depo ?? undefined, type);

    const data = records.map((record) => ({
      nik: record.nik,
      nama: record.nama,
      depo: record.depo,
      func_name: record.funcName,
      check_in: record.checkIn,
      check_out: record.checkOut,
      telat: record.telat,
      pulang_cepat: record.pulangCepat,
      durasi: record.durasi,
      status: deriveAttendanceStatus(record),
    }));

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Fetch absensi check-in failed:', error);
    return NextResponse.json(
      { error: error?.message ?? 'Gagal mengambil data absensi' },
      { status: 500 },
    );
  }
}

