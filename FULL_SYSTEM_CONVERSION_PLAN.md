# Complete HRIS System Conversion Plan

## Overview
Converting the entire HRIS system from PHP to Next.js, including all 12 major modules with 50+ sub-pages.

## Modules to Convert

### ✅ 1. Main Layout & Navigation
**Status:** Complete
- [x] Sidebar navigation with all menu items
- [x] App layout structure
- [x] Dashboard page

### 2. Dashboard Module
**Pages:**
- [x] Main Dashboard (`/dashboard`)
- [ ] Statistics widgets
- [ ] Quick actions
- [ ] Recent activity feed

### 3. Master Data Module (`/master`)
**Sub-modules (12 pages):**
- [ ] Master Bagian (`/master/bagian`)
- [ ] Master Departemen (`/master/departemen`)
- [ ] Master Divisi (`/master/divisi`)
- [ ] Master Depo (`/master/depo`)
- [ ] Master Hari Libur (`/master/hari-libur`)
- [ ] Master Jabatan (`/master/jabatan`)
- [ ] Master Jadwal Kerja (`/master/jadwal-kerja`)
- [ ] Master Level (`/master/level`)
- [ ] Master Periode (`/master/periode`)
- [ ] Master Project (`/master/project`)
- [ ] Master Seksi (`/master/seksi`)
- [ ] Master Sub Bagian (`/master/sub-bagian`)

### 4. Karyawan (Employee) Module (`/karyawan`)
**Pages:**
- [ ] Data Karyawan List (`/karyawan/list`)
- [ ] Tambah Karyawan (`/karyawan/tambah`)
- [ ] Edit Karyawan (`/karyawan/edit/[id]`)
- [ ] Detail Karyawan (`/karyawan/detail/[id]`)
- [ ] Konfirmasi Data (`/karyawan/konfirmasi`)
- [ ] Logout Paksa (`/karyawan/logout-paksa`)

### 5. Data Pelamar (Applicants) Module (`/pelamar`)
**Pages:**
- [ ] Data Pelamar List (`/pelamar/data`)
- [ ] Tambah Pelamar (`/pelamar/tambah`)
- [ ] Detail Pelamar (`/pelamar/detail/[id]`)

### 6. Proses Rekrutmen (Recruitment) Module (`/rekrutmen`)
**Pages:**
- [ ] Proses Rekrutmen (`/rekrutmen/proses`)
- [ ] Hasil Rekrutmen (`/rekrutmen/hasil`)
- [ ] Detail Rekrutmen (`/rekrutmen/detail/[id]`)

### 7. Absensi (Attendance) Module (`/absensi`)
**Pages:**
- [ ] Absensi Biometric (`/absensi/biometric`)
- [ ] Absensi Karyawan (`/absensi/karyawan`)
- [ ] Absensi List (`/absensi/list`)
- [ ] Absensi Shift (`/absensi/shift`)
- [ ] Absensi Valid (`/absensi/valid`)
- [ ] Tambah Manual (`/absensi/tambah-manual`)

### 8. Konfirmasi Kehadiran Module (`/konfirmasi`)
**Pages:**
- [ ] Konfirmasi Masuk (`/konfirmasi/masuk`)
- [ ] Konfirmasi Pulang (`/konfirmasi/pulang`)

### ✅ 9. Payroll Module (`/payroll`)
**Status:** ✅ COMPLETE (10 sub-modules all done)

### 10. Cuti (Leave) Module (`/cuti`)
**Pages:**
- [ ] Pengajuan Cuti (`/cuti/pengajuan`)
- [ ] Approval Cuti (`/cuti/approval`)
- [ ] History Cuti (`/cuti/history`)
- [ ] Saldo Cuti (`/cuti/saldo`)

### 11. Penilaian Karyawan (Performance) Module (`/penilaian`)
**Pages:**
- [ ] Penilaian List (`/penilaian`)
- [ ] Form Penilaian (`/penilaian/form`)
- [ ] Hasil Penilaian (`/penilaian/hasil`)

### 12. Report Module (`/report`)
**Pages:**
- [ ] Report Absensi (`/report/absensi`)
- [ ] Report Bitrix (`/report/bitrix`)
- [ ] Report Cuti (`/report/cuti`)
- [ ] Report Payroll (`/report/payroll`)

### 13. Administrator Module (`/admin`)
**Pages:**
- [ ] User Management (`/admin/users`)
- [ ] Role Management (`/admin/roles`)
- [ ] System Settings (`/admin/settings`)
- [ ] Audit Log (`/admin/audit`)

### 14. Activity Module (`/activity`)
**Pages:**
- [ ] Activity Log (`/activity`)
- [ ] Activity Timeline (`/activity/timeline`)

---

## API Routes Structure

### Master Data APIs
```
/api/master/
  ├── bagian
  ├── departemen
  ├── divisi
  ├── depo
  ├── hari-libur
  ├── jabatan
  ├── jadwal-kerja
  ├── level
  ├── periode
  ├── project
  ├── seksi
  └── sub-bagian
```

### Employee APIs
```
/api/karyawan/
  ├── list
  ├── create
  ├── [id]/update
  ├── [id]/delete
  └── konfirmasi
```

### Attendance APIs
```
/api/absensi/
  ├── biometric
  ├── list
  ├── create
  └── shift
```

### Leave APIs
```
/api/cuti/
  ├── list
  ├── create
  ├── [id]/approve
  └── saldo
```

### Payroll APIs
```
/api/payroll/
  ✅ Already complete (14 routes)
```

---

## Database Tables Required

### Master Data Tables
- `master_bagian`
- `master_departemen`
- `master_divisi`
- `master_depo`
- `master_hari_libur`
- `master_jabatan`
- `master_jadwal_kerja`
- `master_level`
- `master_periode`
- `master_project`
- `master_seksi`
- `master_sub_bagian`

### Core Tables
- `table_karyawan` (Employee)
- `table_pelamar` (Applicants)
- `table_rekrutmen` (Recruitment)
- `table_absensi` (Attendance)
- `table_cuti` (Leave)
- `table_penilaian` (Performance)

### System Tables
- `users`
- `roles`
- `permissions`
- `activity_log`

---

## Implementation Priority

### Phase 1: Critical Modules (Week 1-2)
1. ✅ Main Layout & Navigation
2. ✅ Dashboard
3. ⏳ Master Data (all 12 sub-modules)
4. ⏳ Employee Management

### Phase 2: Core Operations (Week 3-4)
5. Attendance System
6. Leave Management
7. Recruitment Process

### Phase 3: Advanced Features (Week 5-6)
8. Performance Evaluation
9. Reports & Analytics
10. Administrator Functions

### Phase 4: Integration & Testing (Week 7-8)
11. Database integration for all modules
12. Authentication & Authorization
13. Testing & Bug fixes
14. Documentation

---

## File Estimate

### Total Files to Create
- **Pages:** ~60+ page files
- **Components:** ~50+ component files
- **API Routes:** ~40+ API route files
- **Database Queries:** ~30+ query function files
- **Total:** ~180+ files

### Current Progress
- **Created:** ~50+ files (Payroll + Layout)
- **Remaining:** ~130+ files
- **Completion:** ~28%

---

## Next Steps

### Immediate (Next 1-2 hours)
1. Create all Master Data pages (12 pages)
2. Create Employee module pages (6 pages)
3. Create basic API routes for Master & Employee

### Short Term (Next 1-2 days)
4. Create Attendance module (6 pages)
5. Create Leave module (4 pages)
6. Create Recruitment module (3 pages)

### Medium Term (Next week)
7. Create remaining modules
8. Connect all APIs to database
9. Implement authentication
10. Testing & refinement

---

## Decision: Scalable Approach

Given the massive scope (180+ files), I recommend:

### Option A: Complete Structure (Recommended)
Create all essential pages with:
- Complete UI layouts
- Form structures
- Table displays
- Navigation working
- Mock data initially
- Database integration follows

### Option B: Module-by-Module
Complete one module fully (including database) before moving to next.

### Option C: Scaffolding First
Create all page files with basic structure, then fill in functionality.

---

## User Decision Needed

Would you like me to:

1. **Continue creating ALL modules** (180+ files, will take significant time)
2. **Focus on specific critical modules** (which ones?)
3. **Create comprehensive scaffolding** (all pages with basic structure)
4. **Provide implementation guide** (you implement, I provide templates)

Please let me know your preference, and I'll proceed accordingly!

---

**Current Status:** 
- ✅ Payroll Module: 100% Complete
- ✅ Navigation: Complete
- ✅ Dashboard: Complete
- ⏳ Remaining: 11 major modules

**Estimated Total Time for Full Conversion:** 20-30 hours of development work

