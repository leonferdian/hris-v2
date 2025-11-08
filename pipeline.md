# HRIS Absensi - Architecture, Pipeline, and Improvement Plan

## 1) Gambaran Umum Aplikasi
- **Stack**: PHP (procedural + utility classes), MySQL, SQL Server (sqlsrv), jQuery + Ace Admin, Composer vendor (Image Intervention), Cron job PHP.
- **Entry points**:
  - `index.php` (dashboard shell, loads `partials/head.php`, `partials/footer.php`, dan `inc/inc.content.php`)
  - `login.php` (form login)
  - `proc/loginsubmit.php` (proses login, set session, 2-step code verification optional)
  - `crontab/sinkronabsensi.php` (sinkronisasi data absensi lintas DB/linked server)
- **Routing internal**: 
  - `inc/inc.content.php` menentukan konten berdasarkan `$_GET['page'] | mm | sm` dan cek hak akses dari tabel `tbl_webpages`, `tbl_mainmenu`, `tbl_submenu` (MySQL `dashboard_hris`).
  - Menu kiri dinamis `menu_left.php` juga bersumber dari DB hak menu.
- **Konfigurasi**:
  - `partials/config.php` mendefinisikan `WEB_NAME` dan helper `site_url()`.
  - `lib/config/database.php` berisi koneksi multi-DB: `mysql_hris`, `mysql_fp`, `mysql_ftm`, `sqlsrv_hris`, `sqlsrv_ci`, `sqlsrv_ilv`.
  - `lib/database.php` class `DB` wrapper untuk koneksi (`sqlsrv_connect` atau `mysqli_connect`) + wrapper `Connection` (query/fetch/num_rows, khusus sqlsrv).
- **Session/Auth**:
  - `login.php` post ke `proc/loginsubmit.php?act=login`.
  - Password di-hash: `md5($scrambler.md5($password).$scrambler)` dengan `$scrambler` di `lib/config.php`.
  - Set banyak `$_SESSION[...]` untuk identitas, hak depo, brand, dsb. Validasi kembali di `index.php`.
- **Data Absensi**:
  - `crontab/sinkronabsensi.php` melakukan MERGE/INSERT data absensi dari sumber mesin/ILP ke `db_hris` (SQL Server) via linked server `OPENQUERY` dan aturan bisnis telat/pulang cepat/durasi.

## 2) Alur Data Tinggi
- Login (MySQL `dashboard_hris` → validasi user) → set session → `index.php` → `inc/inc.content.php` → ambil include file berdasarkan hak akses dari DB → render UI Ace + jQuery.
- Sinkron absensi (SQL Server `db_hris` sebagai storage akhir) dari:
  - MySQL mesin fingerprint: `MYSQL_FP` dan FTM `MYSQL_FTM` via linked server, diolah per hari.
  - Aplikasi ILP: sumber `db_ilv_padma` (SQL Server via linked server) → MERGE ke `db_hris` → insert ke `table_absensi_log` (func_name = 'ilp').

## 3) Pipeline Saat Ini (Manual/Implicit)
- **Dev/Test**: Manual di XAMPP Windows. Tidak terlihat test otomatis.
- **Build**: Tidak ada langkah build; Composer untuk `intervention/image` tersedia, namun tidak ada script.
- **Deploy**: Kemungkinan manual copy/sync ke server Apache/PHP.
- **Jobs**: `crontab/sinkronabsensi.php` dieksekusi via scheduler (Task Scheduler Windows/cron Linux), berjalan procedural.

### Bagian yang sudah bagus
- Dinamisasi menu/hak akses dari DB, sehingga kontrol akses terpusat.
- Wrapper koneksi DB multi-driver (`sqlsrv`, `mysql`) memudahkan pemanggilan seragam.
- Proses sinkron absensi cukup komprehensif (MERGE, pembersihan data duplikat, kalkulasi telat/pulang cepat/durasi).

### Area perlu perbaikan (prioritas)
1) Keamanan
- Kredensial DB hard-coded dalam repo (`lib/config/database.php`) → pindahkan ke environment variables/.env dan exclude dari VCS.
- Hash password berbasis MD5 + salt statis → migrasi bertahap ke `password_hash()` (bcrypt/argon2id) dengan compat fallback.
- Banyak raw SQL dengan interpolasi string langsung → gunakan prepared statements untuk mencegah SQL Injection.
- Session validation sederhana; belum ada regenerasi session ID setelah login, belum ada SameSite/HttpOnly/Secure flags setup terpusat.

2) Arsitektur/Kode
- Campuran `mysqli_*` procedural lama dan wrapper `DB::connection(...)` → konsolidasikan satu abstraction layer.
- `Connection` wrapper hanya menangani `sqlsrv_*` penuh; untuk MySQL, pemanggilan `fetch_array/num_rows` tidak uniform (kadang properti). Buat adapter MySQL simetris (`query`, `fetch_array`, `num_rows`, `close`).
- Routing via DB bagus, tetapi include file raw `include "$dwebpages[webpage_include]"` berisiko bila tidak difilter ketat. Validasi whitelist path.
- Minim logging/error handling terstruktur pada query gagal.

3) Observability/Operasional
- Tidak ada centralized logging (access/error/app logs) per modul; sulit troubleshooting.
- Tidak ada health-check, job monitoring, atau alerting untuk `sinkronabsensi`.

4) CI/CD & Quality
- Tidak ada linting, static analysis, atau test otomatis.
- Tidak ada pipeline untuk deploy terkontrol multi environment (dev/staging/prod).

## 4) Rekomendasi Pipeline (CI/CD) yang Disarankan
Target sederhana, kompatibel Windows self-hosted runner atau GitHub Actions + rsync/FTP deploy.

### Tahap Pipeline
1) Checks (lint + security)
- PHP Lint: `php -l` terhadap semua `.php`.
- Static analysis: tambahkan `phpstan` atau `psalm` (level moderat), `phpcs` (PSR-12 minimal).
- Composer audit: bila memungkinkan (`composer audit`).

2) Unit/Feature Tests
- Tambahkan kerangka test minimal (PHPUnit). Mulai dari fungsi util (helper, kalkulasi telat/pulang cepat) sebelum menyentuh DB berat.

3) Build & Artifact
- Composer install dengan `--no-dev` untuk release artifact; zip artefak kecuali file environment.

4) Deploy
- Strategi 1 (shared hosting/VM): rsync/FTP hanya file yang berubah, exclude `.env`, `vendor` opsional jika target jalankan `composer install`.
- Strategi 2 (container): bangun image PHP-Apache + kode; jalankan via Docker Compose (lihat bagian Infrastruktur).

5) Post-Deploy
- Jalankan migrasi DB (skrip versi) bila ada.
- Health-check sederhana (request `index.php` dan `login.php`), serta endpoint check koneksi DB.

### Contoh GitHub Actions (ringkas)
```yaml
name: CI
on: [push, pull_request]
jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          extensions: sqlsrv, pdo_sqlsrv, mysqli
      - run: composer install --prefer-dist --no-progress
      - run: vendor/bin/phpcs -q || true
      - run: vendor/bin/phpstan analyse --no-progress || true
      - run: find . -type f -name "*.php" -print0 | xargs -0 -n1 php -l
      - run: zip -r artifact.zip . -x "**/.git/**" "**/vendor/**" "**/.env" "**/image_upload/**"
      - uses: actions/upload-artifact@v4
        with:
          name: hris-absensi-artifact
          path: artifact.zip
```

## 5) Infrastruktur yang Disarankan
### Minimal Non-Container
- Web server: Apache/Nginx + PHP-FPM 8.1/8.2.
- PHP extensions: `sqlsrv`, `pdo_sqlsrv`, `mysqli`, `gd` (untuk intervention/image), `intl`.
- Konfigurasi environment (.env) berisi kredensial DB dan flags.
- Scheduler: jalankan `php crontab/sinkronabsensi.php` via OS scheduler; monitoring log/script exit code.

### Opsi Containerized (disarankan jangka menengah)
- Docker Compose services:
  - `web`: nginx/apache
  - `php`: php-fpm + extensions (sqlsrv membutuhkan base image Debian + Microsoft ODBC driver)
  - `cron`: container ringan menjalankan sinkron job
- Network ke DB MySQL & SQL Server yang sudah eksis (service eksternal).
- Volume untuk `image_upload/` dan logs.

## 6) Rencana Perbaikan Bertahap
1) Konfigurasi & Security (Minggu 1)
- Pindahkan kredensial ke `.env`, gunakan loader (vlucas/phpdotenv). Update `lib/config/database.php` untuk membaca env.
- Tambahkan `session_regenerate_id(true)` saat login; set cookie params (httponly, samesite=lax/strict, secure di https).

2) DB Layer Konsisten (Minggu 1-2)
- Buat adapter MySQL setara class `Connection` untuk `mysqli` dengan API: `query`, `fetch_array`, `num_rows`, `free_stmt`, `close` agar call-site seragam.
- Audit dan ubah query interpolasi menjadi prepared statements, prioritas endpoint login dan form.

3) Observability (Minggu 2)
- Centralized logging (Monolog) untuk error query dan job `crontab/sinkronabsensi.php` ke file terpisah per hari.
- Tambah endpoint `/health` sederhana: cek koneksi `mysql_hris` & `sqlsrv_hris` dan tampilkan status.

4) Quality & Pipeline (Minggu 2-3)
- Tambah `phpcs`, `phpstan`, `phpunit`, dan workflow CI minimal.
- Buat 3-5 test unit untuk fungsi/kueri yang non-ketat terhadap DB (mock/fixtures). 

5) Hardening Login (Minggu 3)
- Implement `password_hash` untuk user baru + migrasi gradual saat user login.
- Rate limiting login (misal simpan counter dan `retry_after`).

6) Job Reliability (Minggu 3-4)
- Logging detail per hari/tanggal, retry sederhana, dan notifikasi (email/telegram) bila terjadi error di sinkron.
- Pisahkan fungsi besar menjadi modul kecil untuk maintainability.

## 7) Progress Terbaru (Okt 2025)
- Locking tanggal validasi kini konsisten antara report HRIS dan KADEPO; cell yang terkunci ditampilkan tanpa tautan dan diberi indikator warna.
- Perhitungan kehadiran HRIS diselaraskan dengan KADEPO (menghapus filter durasi ≥ 6 jam) untuk memastikan angka sinkron.
- Dropdown aksi pada halaman detail HRIS & KADEPO diperbaiki agar tidak terpotong di baris terakhir (auto dropup & reposisi).
- Dokumen `infrastructure.md` ditambahkan: mencakup rencana migrasi Next.js + TypeScript, JWT bridge untuk MD5 lama, Docker Compose, dan integrasi AI assistant.
- Infrastruktur kontainer dan reverse proxy disiapkan agar `absensi` dan `payroll` tetap terpisah sambil menyiapkan front-end modern.

## 8) Inventaris Modul Utama (yang dipetakan)
- `index.php` → shell UI, cek session, muat head/footer, panggil konten berdasarkan `inc/inc.content.php`.
- `login.php`, `proc/loginsubmit.php` → alur login dan 2FA sederhana (via code), set session, redirect.
- `partials/head.php`, `partials/footer.php` → asset dan UI framework.
- `menu_left.php` → generate menu dari DB berdasarkan hak akses.
- `inc/inc.content.php` → routing konten berdasarkan case (`page/mm/sm`) + cek hak akses.
- `lib/config.php` → `$scrambler` dan `Config::get_hari_kerja` (SQL Server).
- `lib/config/database.php` → definisi koneksi DB.
- `lib/database.php` → wrapper `DB` dan `Connection` (sqlsrv-first).
- `crontab/sinkronabsensi.php` → ETL absensi lintas sumber ke `db_hris`.

## 9) Catatan Risiko
- Kredensial sensitif berada di repo; segera rotasi password setelah pemindahan ke `.env`.
- MD5 password menimbulkan risiko kompromi; migrasi prioritas tinggi.
- Query raw rentan injection dan error tak terdeteksi; gunakan prepared statements + error handling.
- Bergantung pada linked server; pastikan SLA konektivitas dan timeout/ retry.

---
Dokumen ini merangkum kondisi saat ini, gap utama, dan jalur peningkatan praktis. Mulai dari security config dan konsistensi DB layer, lalu tambah observability dan pipeline, diakhiri hardening login dan reliability job sinkronisasi.
