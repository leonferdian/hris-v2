# Payroll System Migration Guide

## Overview

This document guides you through migrating from the legacy PHP payroll system to the new Next.js-based system.

## Legacy System Location
```
C:\Users\leo\xampp\htdocs\_hris\absensi\inc\payroll
```

## New System Location
```
C:\Users\leo\lab\hris-v2\apps\web\app\payroll
```

---

## Module Mapping

### PHP → Next.js Module Correspondence

| Legacy PHP Module | New Next.js Route | Status |
|-------------------|-------------------|---------|
| `create_payroll/` | `/payroll/create-payroll` | ✅ Complete |
| `realisasi_payroll/` | `/payroll/realisasi-payroll` | ✅ Complete |
| `master_komponen_gaji/` | `/payroll/master-komponen-gaji` | ✅ Complete |
| `master_skema_gaji/` | `/payroll/master-skema-gaji` | ✅ Complete |
| `skema_gaji_karyawan/` | `/payroll/skema-gaji-karyawan` | ✅ Complete |
| `set_periode_gaji/` | `/payroll/set-periode-gaji` | ✅ Complete |
| `upload_insentif/` | `/payroll/upload-insentif` | ✅ Complete |
| `potongan_bpjs_karyawan/` | `/payroll/potongan-bpjs-karyawan` | ✅ Complete |
| `master_toleransi_terlambat/` | `/payroll/master-toleransi-terlambat` | ✅ Complete |
| `report_by_depo/` | `/payroll/report-by-depo` | ✅ Complete |

---

## Database Migration

### Step 1: Export Legacy Data

Export data from the legacy MySQL database:

```sql
-- Export salary components
SELECT * FROM master_komponen_gaji;

-- Export salary schemes
SELECT * FROM master_skema_gaji;

-- Export employee salary schemes
SELECT * FROM skema_gaji_karyawan;

-- Export payroll periods
SELECT * FROM periode_gaji;

-- Export payroll records
SELECT * FROM payroll_records;

-- Export BPJS deductions
SELECT * FROM bpjs_karyawan;

-- Export late tolerance rules
SELECT * FROM master_toleransi;

-- Export incentives
SELECT * FROM insentif_karyawan;
```

### Step 2: Create New Database Schema

The new system uses the following schema structure:

```sql
-- Salary Components
CREATE TABLE salary_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('allowance', 'deduction')),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Salary Schemes
CREATE TABLE salary_schemes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  basic_salary DECIMAL(15,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Salary Scheme Components
CREATE TABLE salary_scheme_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheme_id UUID REFERENCES salary_schemes(id) ON DELETE CASCADE,
  component_id UUID REFERENCES salary_components(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(scheme_id, component_id)
);

-- Employee Salary Schemes
CREATE TABLE employee_salary_schemes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  scheme_id UUID REFERENCES salary_schemes(id),
  effective_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payroll Periods
CREATE TABLE payroll_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  cutoff_date DATE NOT NULL,
  payment_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'active', 'closed')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payroll Records
CREATE TABLE payroll_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  period_id UUID REFERENCES payroll_periods(id) ON DELETE CASCADE,
  basic_salary DECIMAL(15,2) NOT NULL,
  allowances DECIMAL(15,2) DEFAULT 0,
  overtime DECIMAL(15,2) DEFAULT 0,
  incentives DECIMAL(15,2) DEFAULT 0,
  deductions DECIMAL(15,2) DEFAULT 0,
  net_salary DECIMAL(15,2) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'approved', 'paid')),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(employee_id, period_id)
);

-- BPJS Deductions
CREATE TABLE bpjs_deductions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  bpjs_kesehatan_number VARCHAR(50),
  bpjs_kesehatan_amount DECIMAL(15,2) DEFAULT 0,
  bpjs_ketenagakerjaan_number VARCHAR(50),
  bpjs_ketenagakerjaan_amount DECIMAL(15,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(employee_id)
);

-- Late Tolerance Rules
CREATE TABLE late_tolerance_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  min_minutes INTEGER NOT NULL,
  max_minutes INTEGER NOT NULL,
  deduction_type VARCHAR(20) NOT NULL CHECK (deduction_type IN ('fixed', 'percentage')),
  deduction_amount DECIMAL(15,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Incentives
CREATE TABLE employee_incentives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  period_id UUID REFERENCES payroll_periods(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(employee_id, period_id)
);

-- Create indexes for better performance
CREATE INDEX idx_payroll_records_employee ON payroll_records(employee_id);
CREATE INDEX idx_payroll_records_period ON payroll_records(period_id);
CREATE INDEX idx_payroll_records_status ON payroll_records(status);
CREATE INDEX idx_employee_schemes_employee ON employee_salary_schemes(employee_id);
CREATE INDEX idx_employee_schemes_active ON employee_salary_schemes(is_active);
```

### Step 3: Data Migration Script

Create a migration script to transfer data:

```typescript
// scripts/migrate-payroll.ts
import { db } from './db';

async function migratePayrollData() {
  console.log('Starting payroll data migration...');

  // 1. Migrate salary components
  await migrateSalaryComponents();

  // 2. Migrate salary schemes
  await migrateSalarySchemes();

  // 3. Migrate employee salary schemes
  await migrateEmployeeSalarySchemes();

  // 4. Migrate payroll periods
  await migratePayrollPeriods();

  // 5. Migrate payroll records
  await migratePayrollRecords();

  // 6. Migrate BPJS deductions
  await migrateBPJSDeductions();

  // 7. Migrate late tolerance rules
  await migrateLateTolerance();

  // 8. Migrate incentives
  await migrateIncentives();

  console.log('Migration completed!');
}

// Run migration
migratePayrollData().catch(console.error);
```

---

## Code Migration Examples

### Example 1: Salary Component CRUD

**Legacy PHP (`master_komponen_gaji/main.php`):**
```php
<?php
// Fetch components
$query = "SELECT * FROM master_komponen_gaji WHERE is_active = 1";
$result = mysqli_query($conn, $query);
while ($row = mysqli_fetch_assoc($result)) {
    echo "<tr>";
    echo "<td>" . $row['code'] . "</td>";
    echo "<td>" . $row['name'] . "</td>";
    echo "</tr>";
}
?>
```

**New Next.js (`master-komponen-gaji/page.tsx`):**
```typescript
const [components, setComponents] = useState<SalaryComponent[]>([]);

useEffect(() => {
  fetch('/api/payroll/salary-components')
    .then(res => res.json())
    .then(data => setComponents(data));
}, []);

return (
  <Table>
    <TableBody>
      {components.map(component => (
        <TableRow key={component.id}>
          <TableCell>{component.code}</TableCell>
          <TableCell>{component.name}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
```

### Example 2: Form Submission

**Legacy PHP:**
```php
<?php
if ($_POST['submit']) {
    $code = mysqli_real_escape_string($conn, $_POST['code']);
    $name = mysqli_real_escape_string($conn, $_POST['name']);
    
    $query = "INSERT INTO master_komponen_gaji (code, name) VALUES ('$code', '$name')";
    mysqli_query($conn, $query);
    
    header("Location: main.php?success=1");
}
?>
```

**New Next.js:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const response = await fetch('/api/payroll/salary-components', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, name }),
  });
  
  if (response.ok) {
    alert('Component saved successfully!');
    fetchComponents();
  }
};
```

---

## Configuration Changes

### Environment Variables

**Legacy PHP (`config.php`):**
```php
<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', 'password');
define('DB_NAME', 'hris_db');
?>
```

**New Next.js (`.env.local`):**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/hris_v2
JWT_SECRET=your-jwt-secret
NEXTAUTH_URL=http://localhost:3000
```

---

## Testing the Migration

### 1. Functional Testing

Test each module:

```bash
# Run the development server
cd apps/web
npm run dev
```

Visit each route and verify:
- ✅ Data loads correctly
- ✅ Forms submit successfully
- ✅ Validation works
- ✅ Error handling is proper

### 2. Performance Testing

Compare response times:

```bash
# Legacy PHP
curl -o /dev/null -s -w '%{time_total}\n' http://localhost/hris/payroll/create_payroll/main.php

# New Next.js
curl -o /dev/null -s -w '%{time_total}\n' http://localhost:3000/payroll/create-payroll
```

### 3. Data Integrity Testing

Verify data migration:

```sql
-- Check record counts
SELECT 'PHP', COUNT(*) FROM legacy_db.master_komponen_gaji
UNION ALL
SELECT 'Next.js', COUNT(*) FROM hris_v2.salary_components;
```

---

## Deployment

### 1. Build the Application

```bash
cd apps/web
npm run build
```

### 2. Deploy to Production

Using Docker:

```bash
docker-compose up -d
```

Using Vercel:

```bash
vercel --prod
```

### 3. Post-Deployment Checklist

- [ ] Database connection verified
- [ ] All API routes working
- [ ] Authentication functional
- [ ] File uploads working
- [ ] Reports generating correctly
- [ ] Email notifications sent
- [ ] SSL certificate installed
- [ ] Monitoring setup (Sentry, etc.)

---

## Rollback Plan

If issues arise:

1. **Immediate Rollback:** Switch DNS back to legacy PHP server
2. **Data Sync:** Export any new data from Next.js back to PHP database
3. **Investigation:** Debug issues in staging environment
4. **Gradual Migration:** Use feature flags to gradually enable new modules

---

## Support & Resources

- **Documentation:** `/apps/web/app/payroll/README.md`
- **API Reference:** `/apps/web/app/api/payroll/`
- **Legacy Code:** `/legacy/absensi/inc/payroll/`

---

## Timeline

| Phase | Duration | Status |
|-------|----------|---------|
| Frontend Development | Week 1-2 | ✅ Complete |
| API Development | Week 2-3 | ✅ Complete |
| Database Setup | Week 3 | ⏳ Pending |
| Data Migration | Week 4 | ⏳ Pending |
| Testing | Week 5 | ⏳ Pending |
| Deployment | Week 6 | ⏳ Pending |

---

## Contact

For migration support, contact the development team or refer to project documentation.

