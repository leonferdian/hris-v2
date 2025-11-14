import { querySqlServer } from '@/lib/db/connection';

export type AttendanceType = '1' | '2' | '3';

export interface SyncResult {
  finger?: boolean;
  ilp?: boolean;
}

export interface AttendanceRecord {
  nik: string;
  nama: string;
  depo: string;
  funcName: string | null;
  checkIn: string | null;
  checkOut: string | null;
  telat: string | null;
  pulangCepat: string | null;
  durasi: string | null;
}

const DATE_FORMAT = /^\d{4}-\d{2}-\d{2}$/;

function validateAndFormatDate(date: string | undefined): string {
  if (!date) {
    throw new Error('Tanggal wajib diisi');
  }

  if (!DATE_FORMAT.test(date)) {
    throw new Error('Format tanggal harus YYYY-MM-DD');
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Tanggal tidak valid');
  }

  return date;
}

async function syncAbsensiFinger(formattedDate: string, dayOfWeekNumber: number) {
  await querySqlServer('sqlsrv_hris', `
    DELETE FROM [db_hris].[dbo].[table_absensi_log]
    WHERE [date_absen] = @date
      AND [func_name] NOT IN ('manual','ilp');
  `, { date: formattedDate });

  const manualResult = await querySqlServer<{ nik: string }>('sqlsrv_hris', `
    SELECT DISTINCT [nik]
    FROM [db_hris].[dbo].[table_absensi_log]
    WHERE [date_absen] = @date
      AND [func_name] = 'manual';
  `, { date: formattedDate });

  const manualNiks = manualResult.recordset
    .map((row) => row.nik)
    .filter((nik) => Boolean(nik))
    .map((nik) => nik.replace(/'/g, "''"));

  const manualFilter = manualNiks.length > 0
    ? `\n                    AND absensi.nik NOT IN ('${manualNiks.join("','")}')`
    : '';

  const mysqlFtmQuery = `select * from att_log where cast(scan_date as date) = '${formattedDate}'`;
  const mysqlFpQuery = `select * from att_log where cast(scan_date as date) = '${formattedDate}'`;

  const insertFingerLogQuery = `
INSERT INTO [db_hris].[dbo].[table_absensi_log]
(
  [depo],
  [pin],
  [nik],
  [nama],
  [func_name],
  [tanggal],
  [kode],
  [shift_ot],
  [shift],
  [shift_name],
  [jam_masuk],
  [jam_keluar],
  [start_scan_masuk],
  [start_scan_keluar],
  [end_scan_masuk],
  [end_scan_keluar],
  [time_scan_in],
  [time_scan_out],
  [keterangan],
  [nilai],
  [verifikasi_apps],
  [leave_category],
  [telat],
  [p_cepat],
  [durasi],
  [date_absen]
)
SELECT
  absensi.depo,
  absensi.pin,
  absensi.nik,
  absensi.nama,
  MAX(absensi.func_name) as func_name,
  MAX(absensi.tanggal) as tanggal,
  absensi.kode,
  MAX(absensi.shift_ot) as shift_ot,
  absensi.shift,
  absensi.shift_name,
  MIN(absensi.jam_masuk) AS jam_masuk,
  MAX(absensi.jam_keluar) AS jam_keluar,
  absensi.start_scan_masuk,
  absensi.start_scan_keluar,
  absensi.end_scan_masuk,
  absensi.end_scan_keluar,
  MIN(absensi.time_scan_in) AS time_scan_in,
  MAX(absensi.time_scan_out) AS time_scan_out,
  val.keterangan,
  val.nilai,
  val.verifikasi_apps,
  val.leave_category,
  MIN(
    CASE
      WHEN DATEDIFF(SECOND, TRY_CAST(jam_masuk AS TIME), TRY_CAST(time_scan_in AS TIME)) > 600
      THEN TRY_CAST(DATEADD(SECOND, DATEDIFF(SECOND, TRY_CAST(jam_masuk AS TIME), TRY_CAST(time_scan_in AS TIME)), 0) AS TIME(0))
      ELSE TRY_CAST('00:00:00' AS TIME(0))
    END
  ) AS telat,
  MIN(
    CASE
      WHEN TRY_CAST(time_scan_out AS TIME) < TRY_CAST(jam_keluar AS TIME)
      THEN TRY_CAST(DATEADD(SECOND, DATEDIFF(SECOND, TRY_CAST(time_scan_out AS TIME), TRY_CAST(jam_keluar AS TIME)), 0) AS TIME(0))
      ELSE TRY_CAST('00:00:00' AS TIME(0))
    END
  ) AS p_cepat,
  MAX(
    CASE
      WHEN TRY_CAST(time_scan_out AS TIME) > TRY_CAST(time_scan_in AS TIME)
      THEN TRY_CAST(DATEADD(SECOND, DATEDIFF(SECOND, TRY_CAST(time_scan_in AS TIME), TRY_CAST(time_scan_out AS TIME)), 0) AS TIME(0))
      ELSE TRY_CAST('00:00:00' AS TIME(0))
    END
  ) AS durasi,
  @date AS date_absen
FROM
(
  SELECT
    people.depo,
    people.pin,
    people.nik,
    people.nama,
    absensi_all.func_name,
    absensi_all.tanggal,
    absensi_all.kode,
    absensi_all.shift_ot,
    absensi_all.shift,
    absensi_all.shift_name,
    absensi_all.jam_masuk,
    absensi_all.jam_keluar,
    absensi_all.start_scan_masuk,
    absensi_all.start_scan_keluar,
    absensi_all.end_scan_masuk,
    absensi_all.end_scan_keluar,
    absensi_all.time_scan_in,
    absensi_all.time_scan_out
  FROM
    (
      SELECT *
      FROM (
        SELECT
          cab.cab_name AS depo,
          tabel_karyawan.alias AS nama,
          tabel_karyawan.pin,
          tabel_karyawan.nik
        FROM [db_ftm].[dbo].[emp] AS tabel_karyawan
        LEFT JOIN [db_ftm].[dbo].[cabang] cab
          ON tabel_karyawan.cab_id_auto = cab.cab_id_auto
        WHERE tabel_karyawan.emp_status = '0'
        UNION ALL
        SELECT
          depo.pembagian3_nama AS depo,
          tabel_karyawan.pegawai_nama AS nama,
          tabel_karyawan.pegawai_pin AS pin,
          tabel_karyawan.pegawai_nip AS nik
        FROM [db_fin_pro].[dbo].[pegawai] AS tabel_karyawan
        LEFT JOIN [db_fin_pro].[dbo].[pembagian3] AS depo
          ON tabel_karyawan.pembagian3_id = depo.pembagian3_id
        WHERE tabel_karyawan.pegawai_status = '1'
      ) people_all
      GROUP BY depo, nama, pin, nik
    ) people
    LEFT JOIN
    (
      SELECT
        depo,
        pin,
        nik,
        nama,
        func_name,
        tanggal,
        kode,
        shift_ot,
        shift,
        shift_name,
        jam_masuk,
        jam_keluar,
        start_scan_masuk,
        start_scan_keluar,
        end_scan_masuk,
        end_scan_keluar,
        time_scan_in,
        time_scan_out
      FROM
      (
        SELECT
          CASE WHEN scan_in.depo IS NOT NULL THEN scan_in.depo ELSE scan_out.depo END AS depo,
          CASE WHEN scan_in.pin IS NOT NULL THEN scan_in.pin ELSE scan_out.pin END AS pin,
          CASE WHEN scan_in.nik IS NOT NULL THEN scan_in.nik ELSE scan_out.nik END AS nik,
          CASE WHEN scan_in.nama IS NOT NULL THEN scan_in.nama ELSE scan_out.nama END AS nama,
          CASE WHEN scan_in.func_name IS NOT NULL THEN scan_in.func_name ELSE scan_out.func_name END AS func_name,
          CASE WHEN scan_in.tanggal IS NOT NULL THEN scan_in.tanggal ELSE scan_out.tanggal END AS tanggal,
          CASE WHEN scan_in.kode IS NOT NULL THEN scan_in.kode ELSE scan_out.kode END AS kode,
          CASE WHEN scan_in.shift_ot IS NOT NULL THEN scan_in.shift_ot ELSE scan_out.shift_ot END AS shift_ot,
          CASE WHEN scan_in.[shift] IS NOT NULL THEN scan_in.[shift] ELSE scan_out.[shift] END AS [shift],
          CASE WHEN scan_in.[shift_name] IS NOT NULL THEN scan_in.[shift_name] ELSE scan_out.[shift_name] END AS [shift_name],
          CASE WHEN scan_in.[jam_masuk] IS NOT NULL THEN scan_in.[jam_masuk] ELSE scan_out.[jam_masuk] END AS [jam_masuk],
          CASE WHEN scan_in.[jam_keluar] IS NOT NULL THEN scan_in.[jam_keluar] ELSE scan_out.[jam_keluar] END AS [jam_keluar],
          CASE WHEN scan_in.[start_scan_masuk] IS NOT NULL THEN scan_in.[start_scan_masuk] ELSE scan_out.[start_scan_masuk] END AS [start_scan_masuk],
          CASE WHEN scan_in.[start_scan_keluar] IS NOT NULL THEN scan_in.[start_scan_keluar] ELSE scan_out.[start_scan_keluar] END AS [start_scan_keluar],
          CASE WHEN scan_in.[end_scan_masuk] IS NOT NULL THEN scan_in.[end_scan_masuk] ELSE scan_out.[end_scan_masuk] END AS [end_scan_masuk],
          CASE WHEN scan_in.[end_scan_keluar] IS NOT NULL THEN scan_in.[end_scan_keluar] ELSE scan_out.[end_scan_keluar] END AS [end_scan_keluar],
          scan_in.time_scan AS time_scan_in,
          scan_out.time_scan AS time_scan_out
        FROM
        (
          SELECT
            cab.cab_name AS depo,
            tabel_karyawan.pin,
            tabel_karyawan.func_id_auto,
            tabel_karyawan.nik,
            tabel_karyawan.alias AS nama,
            fc.func_name,
            CAST(att_log.scan_date AS DATE) AS tanggal,
            shift.kode,
            shift.shift_ot,
            jadwal.[shift],
            jadwal.[shift_name],
            jadwal.[jam_masuk],
            jadwal.[jam_keluar],
            jadwal.[start_scan_masuk],
            jadwal.[start_scan_keluar],
            jadwal.[end_scan_masuk],
            jadwal.[end_scan_keluar],
            MIN(CAST(att_log.scan_date AS TIME(0))) AS time_scan
          FROM [db_ftm].[dbo].[emp] AS tabel_karyawan
          LEFT JOIN [db_ftm].[dbo].[cabang] cab
            ON tabel_karyawan.cab_id_auto = cab.cab_id_auto
          LEFT JOIN (
            SELECT *
            FROM [db_ftm].[dbo].[table_shift_emp]
            WHERE day_order = ${dayOfWeekNumber}
          ) shift
            ON tabel_karyawan.pin = shift.pin
            AND tabel_karyawan.nik = shift.nik
            AND tabel_karyawan.alias = shift.alias
          LEFT JOIN (
            SELECT *
            FROM [db_hris].[dbo].[table_absensi_mesin_jadwal]
            WHERE vendor = 'ftm'
          ) jadwal
            ON shift.kode = jadwal.shift
          LEFT JOIN [db_ftm].[dbo].[func] fc
            ON tabel_karyawan.func_id_auto = fc.func_id_auto
          LEFT JOIN OPENQUERY(MYSQL_FTM, '${mysqlFtmQuery}') att_log
            ON tabel_karyawan.pin COLLATE SQL_Latin1_General_CP1_CI_AS = att_log.pin COLLATE SQL_Latin1_General_CP1_CI_AS
          WHERE tabel_karyawan.emp_status = '0'
            AND CAST(att_log.scan_date AS TIME(0)) >= jadwal.start_scan_masuk
            AND CAST(att_log.scan_date AS TIME(0)) < jadwal.start_scan_keluar
          GROUP BY
            cab.cab_name,
            tabel_karyawan.pin,
            tabel_karyawan.func_id_auto,
            tabel_karyawan.nik,
            tabel_karyawan.alias,
            fc.func_name,
            CAST(att_log.scan_date AS DATE),
            shift.kode,
            shift.shift_ot,
            jadwal.[shift],
            jadwal.[shift_name],
            jadwal.[jam_masuk],
            jadwal.[jam_keluar],
            jadwal.[start_scan_masuk],
            jadwal.[start_scan_keluar],
            jadwal.[end_scan_masuk],
            jadwal.[end_scan_keluar]
        ) scan_in
        FULL OUTER JOIN
        (
          SELECT
            cab.cab_name AS depo,
            tabel_karyawan.pin,
            tabel_karyawan.func_id_auto,
            tabel_karyawan.nik,
            tabel_karyawan.alias AS nama,
            fc.func_name,
            CAST(att_log.scan_date AS DATE) AS tanggal,
            shift.kode,
            shift.shift_ot,
            jadwal.[shift],
            jadwal.[shift_name],
            jadwal.[jam_masuk],
            jadwal.[jam_keluar],
            jadwal.[start_scan_masuk],
            jadwal.[start_scan_keluar],
            jadwal.[end_scan_masuk],
            jadwal.[end_scan_keluar],
            MAX(CAST(att_log.scan_date AS TIME(0))) AS time_scan
          FROM [db_ftm].[dbo].[emp] AS tabel_karyawan
          LEFT JOIN [db_ftm].[dbo].[cabang] cab
            ON tabel_karyawan.cab_id_auto = cab.cab_id_auto
          LEFT JOIN (
            SELECT *
            FROM [db_ftm].[dbo].[table_shift_emp]
            WHERE day_order = ${dayOfWeekNumber}
          ) shift
            ON tabel_karyawan.pin = shift.pin
            AND tabel_karyawan.nik = shift.nik
            AND tabel_karyawan.alias = shift.alias
          LEFT JOIN (
            SELECT *
            FROM [db_hris].[dbo].[table_absensi_mesin_jadwal]
            WHERE vendor = 'ftm'
          ) jadwal
            ON shift.kode = jadwal.shift
          LEFT JOIN [db_ftm].[dbo].[func] fc
            ON tabel_karyawan.func_id_auto = fc.func_id_auto
          LEFT JOIN OPENQUERY(MYSQL_FTM, '${mysqlFtmQuery}') att_log
            ON tabel_karyawan.pin COLLATE SQL_Latin1_General_CP1_CI_AS = att_log.pin COLLATE SQL_Latin1_General_CP1_CI_AS
          WHERE tabel_karyawan.emp_status = '0'
            AND CAST(att_log.scan_date AS TIME(0)) >= jadwal.start_scan_keluar
            AND CAST(att_log.scan_date AS TIME(0)) <= jadwal.end_scan_keluar
          GROUP BY
            cab.cab_name,
            tabel_karyawan.pin,
            tabel_karyawan.func_id_auto,
            tabel_karyawan.nik,
            tabel_karyawan.alias,
            fc.func_name,
            CAST(att_log.scan_date AS DATE),
            shift.kode,
            shift.shift_ot,
            jadwal.[shift],
            jadwal.[shift_name],
            jadwal.[jam_masuk],
            jadwal.[jam_keluar],
            jadwal.[start_scan_masuk],
            jadwal.[start_scan_keluar],
            jadwal.[end_scan_masuk],
            jadwal.[end_scan_keluar]
        ) scan_out
          ON scan_in.depo = scan_out.depo
          AND scan_in.tanggal = scan_out.tanggal
          AND scan_in.pin = scan_out.pin
          AND scan_in.nik = scan_out.nik
          AND scan_in.kode = scan_out.kode
      ) absensi
      UNION ALL
      SELECT
        depo,
        pin,
        nik,
        nama,
        func_name,
        tanggal,
        kode,
        shift_ot,
        [shift],
        shift_name,
        jam_masuk,
        jam_keluar,
        start_scan_masuk,
        start_scan_keluar,
        end_scan_masuk,
        end_scan_keluar,
        time_scan_in,
        time_scan_out
      FROM
      (
        SELECT
          CASE WHEN scan_in.depo IS NOT NULL THEN scan_in.depo ELSE scan_out.depo END AS depo,
          CASE WHEN scan_in.pin IS NOT NULL THEN scan_in.pin ELSE scan_out.pin END AS pin,
          CASE WHEN scan_in.nik IS NOT NULL THEN scan_in.nik ELSE scan_out.nik END AS nik,
          CASE WHEN scan_in.nama IS NOT NULL THEN scan_in.nama ELSE scan_out.nama END AS nama,
          '' AS func_name,
          CASE WHEN scan_in.tanggal IS NOT NULL THEN scan_in.tanggal ELSE scan_out.tanggal END AS tanggal,
          CASE WHEN scan_in.kode IS NOT NULL THEN scan_in.kode ELSE scan_out.kode END AS kode,
          CASE WHEN scan_in.shift_ot IS NOT NULL THEN scan_in.shift_ot ELSE scan_out.shift_ot END AS shift_ot,
          CASE WHEN scan_in.[shift] IS NOT NULL THEN scan_in.[shift] ELSE scan_out.[shift] END AS [shift],
          CASE WHEN scan_in.[shift_name] IS NOT NULL THEN scan_in.[shift_name] ELSE scan_out.[shift_name] END AS [shift_name],
          CASE WHEN scan_in.[jam_masuk] IS NOT NULL THEN scan_in.[jam_masuk] ELSE scan_out.[jam_masuk] END AS [jam_masuk],
          CASE WHEN scan_in.[jam_keluar] IS NOT NULL THEN scan_in.[jam_keluar] ELSE scan_out.[jam_keluar] END AS [jam_keluar],
          CASE WHEN scan_in.[start_scan_masuk] IS NOT NULL THEN scan_in.[start_scan_masuk] ELSE scan_out.[start_scan_masuk] END AS [start_scan_masuk],
          CASE WHEN scan_in.[start_scan_keluar] IS NOT NULL THEN scan_in.[start_scan_keluar] ELSE scan_out.[start_scan_keluar] END AS [start_scan_keluar],
          CASE WHEN scan_in.[end_scan_masuk] IS NOT NULL THEN scan_in.[end_scan_masuk] ELSE scan_out.[end_scan_masuk] END AS [end_scan_masuk],
          CASE WHEN scan_in.[end_scan_keluar] IS NOT NULL THEN scan_in.[end_scan_keluar] ELSE scan_out.[end_scan_keluar] END AS [end_scan_keluar],
          scan_in.time_scan AS time_scan_in,
          scan_out.time_scan AS time_scan_out
        FROM
        (
          SELECT
            depo.pembagian3_nama AS depo,
            tabel_karyawan.pegawai_pin AS pin,
            tabel_karyawan.pegawai_nip AS nik,
            tabel_karyawan.pegawai_nama AS nama,
            CAST(att_log.scan_date AS DATE) AS tanggal,
            shift.kode,
            shift.shift_ot,
            jadwal.[shift],
            jadwal.[shift_name],
            jadwal.[jam_masuk],
            jadwal.[jam_keluar],
            jadwal.[start_scan_masuk],
            jadwal.[start_scan_keluar],
            jadwal.[end_scan_masuk],
            jadwal.[end_scan_keluar],
            MIN(CAST(att_log.scan_date AS TIME(0))) AS time_scan
          FROM [db_fin_pro].[dbo].[pegawai] AS tabel_karyawan
          LEFT JOIN [db_fin_pro].[dbo].[pembagian3] AS depo
            ON tabel_karyawan.pembagian3_id = depo.pembagian3_id
          LEFT JOIN (
            SELECT *
            FROM [db_fin_pro].[dbo].[table_shift_pegawai]
            WHERE day_order = ${dayOfWeekNumber}
          ) shift
            ON tabel_karyawan.pegawai_pin = shift.pin
            AND tabel_karyawan.pegawai_nip = shift.nik
            AND tabel_karyawan.pegawai_nama = shift.alias
          LEFT JOIN (
            SELECT *
            FROM [db_hris].[dbo].[table_absensi_mesin_jadwal]
            WHERE vendor = 'fp'
          ) jadwal
            ON shift.kode = jadwal.shift
          LEFT JOIN OPENQUERY(MYSQL_FP, '${mysqlFpQuery}') att_log
            ON tabel_karyawan.pegawai_pin COLLATE SQL_Latin1_General_CP1_CI_AS = att_log.pin COLLATE SQL_Latin1_General_CP1_CI_AS
          WHERE tabel_karyawan.pegawai_status = '1'
            AND CAST(att_log.scan_date AS TIME(0)) >= jadwal.start_scan_masuk
            AND CAST(att_log.scan_date AS TIME(0)) < jadwal.start_scan_keluar
          GROUP BY
            depo.pembagian3_nama,
            tabel_karyawan.pegawai_pin,
            tabel_karyawan.pegawai_nip,
            tabel_karyawan.pegawai_nama,
            CAST(att_log.scan_date AS DATE),
            shift.kode,
            shift.shift_ot,
            jadwal.[shift],
            jadwal.[shift_name],
            jadwal.[jam_masuk],
            jadwal.[jam_keluar],
            jadwal.[start_scan_masuk],
            jadwal.[start_scan_keluar],
            jadwal.[end_scan_masuk],
            jadwal.[end_scan_keluar]
        ) scan_in
        FULL OUTER JOIN
        (
          SELECT
            depo.pembagian3_nama AS depo,
            tabel_karyawan.pegawai_pin AS pin,
            tabel_karyawan.pegawai_nip AS nik,
            tabel_karyawan.pegawai_nama AS nama,
            CAST(att_log.scan_date AS DATE) AS tanggal,
            shift.kode,
            shift.shift_ot,
            jadwal.[shift],
            jadwal.[shift_name],
            jadwal.[jam_masuk],
            jadwal.[jam_keluar],
            jadwal.[start_scan_masuk],
            jadwal.[start_scan_keluar],
            jadwal.[end_scan_masuk],
            jadwal.[end_scan_keluar],
            MAX(CAST(att_log.scan_date AS TIME(0))) AS time_scan
          FROM [db_fin_pro].[dbo].[pegawai] AS tabel_karyawan
          LEFT JOIN [db_fin_pro].[dbo].[pembagian3] AS depo
            ON tabel_karyawan.pembagian3_id = depo.pembagian3_id
          LEFT JOIN (
            SELECT *
            FROM [db_fin_pro].[dbo].[table_shift_pegawai]
            WHERE day_order = ${dayOfWeekNumber}
          ) shift
            ON tabel_karyawan.pegawai_pin = shift.pin
            AND tabel_karyawan.pegawai_nip = shift.nik
            AND tabel_karyawan.pegawai_nama = shift.alias
          LEFT JOIN (
            SELECT *
            FROM [db_hris].[dbo].[table_absensi_mesin_jadwal]
            WHERE vendor = 'fp'
          ) jadwal
            ON shift.kode = jadwal.shift
          LEFT JOIN OPENQUERY(MYSQL_FP, '${mysqlFpQuery}') att_log
            ON tabel_karyawan.pegawai_pin COLLATE SQL_Latin1_General_CP1_CI_AS = att_log.pin COLLATE SQL_Latin1_General_CP1_CI_AS
          WHERE tabel_karyawan.pegawai_status = '1'
            AND CAST(att_log.scan_date AS TIME(0)) >= jadwal.start_scan_keluar
            AND CAST(att_log.scan_date AS TIME(0)) <= jadwal.end_scan_keluar
          GROUP BY
            depo.pembagian3_nama,
            tabel_karyawan.pegawai_pin,
            tabel_karyawan.pegawai_nip,
            tabel_karyawan.pegawai_nama,
            CAST(att_log.scan_date AS DATE),
            shift.kode,
            shift.shift_ot,
            jadwal.[shift],
            jadwal.[shift_name],
            jadwal.[jam_masuk],
            jadwal.[jam_keluar],
            jadwal.[start_scan_masuk],
            jadwal.[start_scan_keluar],
            jadwal.[end_scan_masuk],
            jadwal.[end_scan_keluar]
        ) scan_out
          ON scan_in.depo = scan_out.depo
          AND scan_in.tanggal = scan_out.tanggal
          AND scan_in.pin = scan_out.pin
          AND scan_in.nik = scan_out.nik
          AND scan_in.kode = scan_out.kode
      ) absensi
    ) absensi_all
      ON people.depo = absensi_all.depo
      AND people.nama = absensi_all.nama
      AND people.pin = absensi_all.pin
      AND people.nik = absensi_all.nik
) absensi
LEFT JOIN (
  SELECT
    a.id,
    a.[nik],
    a.[validated_by],
    a.[dtmCreate],
    a.[keterangan],
    a.nilai,
    a.verifikasi_apps,
    a.leave_category,
    b.[keterangan] AS keterangan_def,
    b.leave_category AS lc_name,
    c.status
  FROM [db_hris].[dbo].[table_absensi_validasi] a
  LEFT JOIN [db_hris].[dbo].[table_absensi_leave_category] b
    ON a.leave_category = b.id
  LEFT JOIN [db_hris].[dbo].[table_absensi_validasi_status] c
    ON a.id = c.id_validasi
  WHERE a.date_absen = @date
) val
  ON absensi.nik = val.nik
WHERE absensi.depo IS NOT NULL${manualFilter}
GROUP BY
  absensi.depo,
  absensi.pin,
  absensi.nik,
  absensi.nama,
  absensi.tanggal,
  absensi.kode,
  absensi.shift,
  absensi.shift_name,
  absensi.start_scan_masuk,
  absensi.start_scan_keluar,
  absensi.time_scan_in,
  absensi.time_scan_out,
  absensi.end_scan_masuk,
  absensi.end_scan_keluar,
  val.keterangan,
  val.nilai,
  val.verifikasi_apps,
  val.leave_category
ORDER BY
  absensi.depo,
  absensi.nama,
  absensi.tanggal,
  absensi.time_scan_in,
  absensi.time_scan_out;
`;

  await querySqlServer('sqlsrv_hris', insertFingerLogQuery, { date: formattedDate });
}

async function syncAbsensiILP(formattedDate: string) {
  const mergeQuery = `
MERGE [db_hris].[dbo].[table_absensi_ilp] AS target
USING (
  SELECT 
    a.[id],
    a.[id_user],
    a.[time_check_in],
    a.[time_check_out],
    a.[address_check_in],
    a.[address_check_out],
    a.[lat_check_in],
    a.[lng_check_in],
    a.[lat_check_out],
    a.[lng_check_out],
    a.[image_absen],
    a.[id_company],
    a.[status_absensi],
    a.[create_by],
    a.[date_create],
    a.[update_by],
    a.[date_update],
    b.[username],
    b.[nik],
    b.[nama_user]
  FROM [ILP_LINKED].[db_ilv_padma].[dbo].[table_absensi] a
  LEFT JOIN [ILP_LINKED].[db_ilv_padma].[dbo].[table_user] b
    ON a.id_user = b.id
  WHERE CAST(a.[date_create] AS date) = @date
) AS source
ON (target.id = source.id)
WHEN MATCHED THEN
  UPDATE SET
    target.id_user = source.id_user,
    target.time_check_in = source.time_check_in,
    target.time_check_out = source.time_check_out,
    target.address_check_in = source.address_check_in,
    target.address_check_out = source.address_check_out,
    target.lat_check_in = source.lat_check_in,
    target.lng_check_in = source.lng_check_in,
    target.lat_check_out = source.lat_check_out,
    target.lng_check_out = source.lng_check_out,
    target.image_absen = source.image_absen,
    target.id_company = source.id_company,
    target.status_absensi = source.status_absensi,
    target.create_by = source.create_by,
    target.date_create = source.date_create,
    target.update_by = source.update_by,
    target.date_update = source.date_update,
    target.username = source.username,
    target.nik = source.nik,
    target.nama_user = source.nama_user
WHEN NOT MATCHED THEN
  INSERT (
    id, id_user, time_check_in, time_check_out,
    address_check_in, address_check_out, lat_check_in, lng_check_in,
    lat_check_out, lng_check_out, image_absen, id_company,
    status_absensi, create_by, date_create, update_by, date_update,
    username, nik, nama_user
  ) VALUES (
    source.id, source.id_user, source.time_check_in, source.time_check_out,
    source.address_check_in, source.address_check_out, source.lat_check_in, source.lng_check_in,
    source.lat_check_out, source.lng_check_out, source.image_absen, source.id_company,
    source.status_absensi, source.create_by, source.date_create, source.update_by, source.date_update,
    source.username, source.nik, source.nama_user
  );
`;

  await querySqlServer('sqlsrv_hris', mergeQuery, { date: formattedDate });

  const existingILP = await querySqlServer<{ nik: string }>('sqlsrv_hris', `
    SELECT DISTINCT nik
    FROM [db_hris].[dbo].[table_absensi_log]
    WHERE [date_absen] = @date
      AND [func_name] = 'ilp';
  `, { date: formattedDate });

  const existingNikFilter = existingILP.recordset.length > 0
    ? ` AND a.nik NOT IN (SELECT nik FROM [db_hris].[dbo].[table_absensi_log] WHERE [date_absen] = @date)`
    : '';

  const insertILPQuery = `
INSERT INTO [db_hris].[dbo].[table_absensi_log]
(
  [depo],
  [pin],
  [nik],
  [nama],
  [func_name],
  [tanggal],
  [time_scan_in],
  [time_scan_out],
  [durasi],
  [date_absen]
)
SELECT
  b.depo,
  b.pin,
  a.nik,
  a.[nama_user],
  'ilp' AS func_name,
  CONVERT(date, a.[date_create]) AS tanggal,
  [time_check_in],
  [time_check_out],
  CONVERT(VARCHAR(8),
    DATEADD(
      SECOND,
      DATEDIFF(SECOND, MAX(a.[time_check_in]), MAX(a.[time_check_out])),
      0
    ),
    108
  ) AS durasi,
  CONVERT(date, a.[date_create]) AS [date_absen]
FROM [db_hris].[dbo].[table_absensi_ilp] a
LEFT JOIN [db_hris].[dbo].[table_karyawan] b
  ON a.nik COLLATE SQL_Latin1_General_CP1_CI_AS = b.nik COLLATE SQL_Latin1_General_CP1_CI_AS
WHERE CONVERT(date, a.[date_create]) = @date${existingNikFilter}
  AND b.preferensi_absen = 'ilp'
GROUP BY
  b.depo,
  b.pin,
  a.nik,
  a.[nama_user],
  a.[date_create],
  [time_check_in],
  [time_check_out];
`;

  await querySqlServer('sqlsrv_hris', insertILPQuery, { date: formattedDate });

  const updateILPQuery = `
UPDATE t
SET 
  t.depo         = src.depo,
  t.pin          = src.pin,
  t.nik          = src.nik,
  t.nama         = src.nama,
  t.func_name    = src.func_name,
  t.tanggal      = src.tanggal,
  t.time_scan_in = src.time_scan_in,
  t.time_scan_out= src.time_scan_out,
  t.durasi       = src.durasi,
  t.date_absen   = src.date_absen
FROM [db_hris].[dbo].[table_absensi_log] t
INNER JOIN (
  SELECT 
    people.depo,
    people.pin,
    people.nik,
    people.nama,
    'ilp' AS func_name,
    CAST(absensi_ilp.date_create AS date) AS tanggal,
    MAX(absensi_ilp.time_check_in) AS time_scan_in,
    MAX(absensi_ilp.time_check_out) AS time_scan_out,
    CONVERT(VARCHAR(8),
      DATEADD(
        SECOND,
        DATEDIFF(SECOND, MAX(absensi_ilp.time_check_in), MAX(absensi_ilp.time_check_out)),
        0
      ),
      108
    ) AS durasi,
    CAST(absensi_ilp.date_create AS date) AS date_absen
  FROM [db_hris].[dbo].[table_absensi_ilp] absensi_ilp
  LEFT JOIN (
    SELECT *
    FROM (
      SELECT 
        cab.cab_name AS depo,
        tabel_karyawan.alias AS nama,
        tabel_karyawan.pin,
        tabel_karyawan.nik
      FROM [db_ftm].[dbo].[emp] AS tabel_karyawan
      LEFT JOIN [db_ftm].[dbo].[cabang] cab
        ON tabel_karyawan.cab_id_auto = cab.cab_id_auto
      WHERE tabel_karyawan.emp_status = '0'
      UNION ALL
      SELECT 
        depo.pembagian3_nama AS depo,
        tabel_karyawan.pegawai_nama AS nama,
        tabel_karyawan.pegawai_pin AS pin,
        tabel_karyawan.pegawai_nip AS nik
      FROM [db_fin_pro].[dbo].[pegawai] AS tabel_karyawan
      LEFT JOIN [db_fin_pro].[dbo].[pembagian3] AS depo
        ON tabel_karyawan.pembagian3_id = depo.pembagian3_id
      WHERE tabel_karyawan.pegawai_status = '1'
    ) people_all
    GROUP BY depo, nama, pin, nik
  ) people
    ON people.nik = absensi_ilp.nik
  WHERE CAST(absensi_ilp.date_create AS date) = @date
    AND people.pin IS NOT NULL
  GROUP BY 
    people.depo, 
    people.pin, 
    people.nik, 
    people.nama, 
    CAST(absensi_ilp.date_create AS date)
) src
  ON t.nik = src.nik
  AND t.date_absen = src.date_absen
WHERE t.date_absen = @date
  AND t.tanggal IS NULL;
`;

  await querySqlServer('sqlsrv_hris', updateILPQuery, { date: formattedDate });
}

export async function syncAbsensi(date: string, type: AttendanceType): Promise<SyncResult> {
  const formattedDate = validateAndFormatDate(date);
  const dayOfWeekNumber = new Date(formattedDate).getDay() === 0 ? 7 : new Date(formattedDate).getDay();

  const result: SyncResult = {};

  if (type === '1' || type === '3') {
    await syncAbsensiFinger(formattedDate, dayOfWeekNumber);
    result.finger = true;
  }

  if (type === '2' || type === '3') {
    await syncAbsensiILP(formattedDate);
    result.ilp = true;
  }

  return result;
}

export async function fetchAttendanceCheckin(
  date: string,
  depo: string | undefined,
  type: AttendanceType
): Promise<AttendanceRecord[]> {
  const formattedDate = validateAndFormatDate(date);
  const normalizedDepo = !depo || depo === 'all' ? null : depo;

  const query = `
SELECT
  log.nik,
  log.nama,
  log.depo,
  log.func_name,
  FORMAT(log.time_scan_in, 'HH:mm:ss') AS check_in,
  FORMAT(log.time_scan_out, 'HH:mm:ss') AS check_out,
  FORMAT(log.telat, 'HH:mm:ss') AS telat,
  FORMAT(log.p_cepat, 'HH:mm:ss') AS pulang_cepat,
  FORMAT(log.durasi, 'HH:mm:ss') AS durasi
FROM [db_hris].[dbo].[table_absensi_log] log
WHERE log.date_absen = @date
  AND (@depo IS NULL OR log.depo = @depo)
  AND (
        @type = '3'
     OR (@type = '1' AND (log.func_name IS NULL OR log.func_name <> 'ilp'))
     OR (@type = '2' AND log.func_name = 'ilp')
  )
ORDER BY log.depo, log.nama, log.time_scan_in;
`;

  const response = await querySqlServer<AttendanceRecord>('sqlsrv_hris', query, {
    date: formattedDate,
    depo: normalizedDepo,
    type,
  });

  return response.recordset.map((row) => ({
    nik: row.nik,
    nama: row.nama,
    depo: row.depo,
    funcName: row.funcName ?? row.func_name ?? null,
    checkIn: row.checkIn ?? row.check_in ?? null,
    checkOut: row.checkOut ?? row.check_out ?? null,
    telat: row.telat,
    pulangCepat: row.pulangCepat ?? row.pulang_cepat ?? null,
    durasi: row.durasi,
  }));
}

export function deriveAttendanceStatus(record: AttendanceRecord): string {
  if (!record.checkIn) {
    return 'Tidak Masuk';
  }

  if (record.telat && record.telat !== '00:00:00') {
    return 'Terlambat';
  }

  return 'Hadir';
}

