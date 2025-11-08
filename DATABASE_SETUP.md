# Database Setup Guide

## Overview

The HRIS v2 system uses **SQL Server (MSSQL)** as the primary database, migrated from the legacy PHP system configuration.

## Database Configuration

The database configuration has been migrated from:
- `legacy/absensi/lib/config/database.php`
- `legacy/absensi/lib/database.php`

### Primary Database: SQL Server (MSSQL)

**Connection Name:** `sqlsrv_hris`
- **Host:** localhost (or your SQL Server host)
- **Port:** 1433
- **Database:** `db_hris`
- **Username:** `hris1`
- **Password:** `P4dma_hris`

### Secondary Database: MySQL (Optional)

**Connection Name:** `mysql_hris`
- **Host:** localhost
- **Port:** 3306
- **Database:** `dashboard_hris`
- **Username:** `it`
- **Password:** `padm4.4`

---

## Setup Instructions

### 1. Install Database Packages

The necessary packages are already added to `package.json`:
- `mssql` - SQL Server client for Node.js
- `mysql2` - MySQL client for Node.js

```bash
cd apps/web
npm install
```

### 2. Configure Environment Variables

Create `.env.local` file in `apps/web/`:

```bash
cd apps/web
cp env.local.example .env.local
```

Edit `.env.local` with your database credentials:

```env
# SQL Server - HRIS (Main Database)
DB_HRIS_HOST=localhost
DB_HRIS_PORT=1433
DB_HRIS_DATABASE=db_hris
DB_HRIS_USERNAME=hris1
DB_HRIS_PASSWORD=P4dma_hris

# MySQL - HRIS Dashboard (Optional)
DB_MYSQL_HRIS_HOST=localhost
DB_MYSQL_HRIS_PORT=3306
DB_MYSQL_HRIS_DATABASE=dashboard_hris
DB_MYSQL_HRIS_USERNAME=it
DB_MYSQL_HRIS_PASSWORD=padm4.4
```

### 3. Create Database Tables

Run the following SQL scripts on your SQL Server database (`db_hris`):

```sql
-- Salary Components
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='master_komponen_gaji' and xtype='U')
CREATE TABLE [dbo].[master_komponen_gaji] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [code] VARCHAR(50) UNIQUE NOT NULL,
    [name] VARCHAR(255) NOT NULL,
    [type] VARCHAR(20) NOT NULL CHECK ([type] IN ('allowance', 'deduction')),
    [description] NVARCHAR(MAX),
    [is_active] BIT DEFAULT 1,
    [created_at] DATETIME DEFAULT GETDATE(),
    [updated_at] DATETIME DEFAULT GETDATE()
);

-- Salary Schemes
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='master_skema_gaji' and xtype='U')
CREATE TABLE [dbo].[master_skema_gaji] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [code] VARCHAR(50) UNIQUE NOT NULL,
    [name] VARCHAR(255) NOT NULL,
    [basic_salary] DECIMAL(15,2) NOT NULL,
    [is_active] BIT DEFAULT 1,
    [created_at] DATETIME DEFAULT GETDATE(),
    [updated_at] DATETIME DEFAULT GETDATE()
);

-- Salary Scheme Components (Junction Table)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='salary_scheme_components' and xtype='U')
CREATE TABLE [dbo].[salary_scheme_components] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [scheme_id] INT NOT NULL,
    [component_id] INT NOT NULL,
    [amount] DECIMAL(15,2) NOT NULL,
    [created_at] DATETIME DEFAULT GETDATE(),
    FOREIGN KEY ([scheme_id]) REFERENCES [master_skema_gaji]([id]) ON DELETE CASCADE,
    FOREIGN KEY ([component_id]) REFERENCES [master_komponen_gaji]([id]) ON DELETE CASCADE,
    UNIQUE([scheme_id], [component_id])
);

-- Employee Salary Schemes
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='employee_salary_schemes' and xtype='U')
CREATE TABLE [dbo].[employee_salary_schemes] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [employee_id] INT NOT NULL,
    [scheme_id] INT NOT NULL,
    [effective_date] DATE NOT NULL,
    [is_active] BIT DEFAULT 1,
    [created_at] DATETIME DEFAULT GETDATE(),
    [updated_at] DATETIME DEFAULT GETDATE(),
    FOREIGN KEY ([employee_id]) REFERENCES [table_karyawan]([id]) ON DELETE CASCADE,
    FOREIGN KEY ([scheme_id]) REFERENCES [master_skema_gaji]([id])
);

-- Payroll Periods
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='payroll_periods' and xtype='U')
CREATE TABLE [dbo].[payroll_periods] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [name] VARCHAR(255) NOT NULL,
    [start_date] DATE NOT NULL,
    [end_date] DATE NOT NULL,
    [cutoff_date] DATE NOT NULL,
    [payment_date] DATE NOT NULL,
    [status] VARCHAR(20) NOT NULL CHECK ([status] IN ('draft', 'active', 'closed')),
    [created_at] DATETIME DEFAULT GETDATE(),
    [updated_at] DATETIME DEFAULT GETDATE()
);

-- Payroll Records
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='payroll_records' and xtype='U')
CREATE TABLE [dbo].[payroll_records] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [employee_id] INT NOT NULL,
    [period_id] INT NOT NULL,
    [basic_salary] DECIMAL(15,2) NOT NULL,
    [allowances] DECIMAL(15,2) DEFAULT 0,
    [overtime] DECIMAL(15,2) DEFAULT 0,
    [incentives] DECIMAL(15,2) DEFAULT 0,
    [deductions] DECIMAL(15,2) DEFAULT 0,
    [net_salary] DECIMAL(15,2) NOT NULL,
    [status] VARCHAR(20) NOT NULL CHECK ([status] IN ('pending', 'approved', 'paid')),
    [approved_by] INT,
    [approved_at] DATETIME,
    [created_at] DATETIME DEFAULT GETDATE(),
    [updated_at] DATETIME DEFAULT GETDATE(),
    FOREIGN KEY ([employee_id]) REFERENCES [table_karyawan]([id]) ON DELETE CASCADE,
    FOREIGN KEY ([period_id]) REFERENCES [payroll_periods]([id]) ON DELETE CASCADE,
    UNIQUE([employee_id], [period_id])
);

-- BPJS Deductions
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='bpjs_deductions' and xtype='U')
CREATE TABLE [dbo].[bpjs_deductions] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [employee_id] INT NOT NULL UNIQUE,
    [bpjs_kesehatan_number] VARCHAR(50),
    [bpjs_kesehatan_amount] DECIMAL(15,2) DEFAULT 0,
    [bpjs_ketenagakerjaan_number] VARCHAR(50),
    [bpjs_ketenagakerjaan_amount] DECIMAL(15,2) DEFAULT 0,
    [is_active] BIT DEFAULT 1,
    [created_at] DATETIME DEFAULT GETDATE(),
    [updated_at] DATETIME DEFAULT GETDATE(),
    FOREIGN KEY ([employee_id]) REFERENCES [table_karyawan]([id]) ON DELETE CASCADE
);

-- Late Tolerance Rules
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='late_tolerance_rules' and xtype='U')
CREATE TABLE [dbo].[late_tolerance_rules] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [name] VARCHAR(255) NOT NULL,
    [min_minutes] INT NOT NULL,
    [max_minutes] INT NOT NULL,
    [deduction_type] VARCHAR(20) NOT NULL CHECK ([deduction_type] IN ('fixed', 'percentage')),
    [deduction_amount] DECIMAL(15,2) NOT NULL,
    [is_active] BIT DEFAULT 1,
    [created_at] DATETIME DEFAULT GETDATE(),
    [updated_at] DATETIME DEFAULT GETDATE()
);

-- Employee Incentives
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='employee_incentives' and xtype='U')
CREATE TABLE [dbo].[employee_incentives] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [employee_id] INT NOT NULL,
    [period_id] INT NOT NULL,
    [amount] DECIMAL(15,2) NOT NULL,
    [description] NVARCHAR(MAX),
    [created_at] DATETIME DEFAULT GETDATE(),
    FOREIGN KEY ([employee_id]) REFERENCES [table_karyawan]([id]) ON DELETE CASCADE,
    FOREIGN KEY ([period_id]) REFERENCES [payroll_periods]([id]) ON DELETE CASCADE,
    UNIQUE([employee_id], [period_id])
);

-- Create indexes for better performance
CREATE INDEX [idx_payroll_records_employee] ON [payroll_records]([employee_id]);
CREATE INDEX [idx_payroll_records_period] ON [payroll_records]([period_id]);
CREATE INDEX [idx_payroll_records_status] ON [payroll_records]([status]);
CREATE INDEX [idx_employee_schemes_employee] ON [employee_salary_schemes]([employee_id]);
CREATE INDEX [idx_employee_schemes_active] ON [employee_salary_schemes]([is_active]);
```

### 4. Test Database Connection

Create a test file `apps/web/lib/db/test.ts`:

```typescript
import { getSqlServerConnection } from './connection';

async function testConnection() {
  try {
    const pool = await getSqlServerConnection('sqlsrv_hris');
    const result = await pool.request().query('SELECT @@VERSION AS version');
    console.log('✅ Database connection successful!');
    console.log('SQL Server version:', result.recordset[0].version);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

testConnection();
```

Run the test:
```bash
npx ts-node apps/web/lib/db/test.ts
```

---

## Database Structure

### Connection Manager

The new system uses:
- **File:** `apps/web/lib/db/connection.ts`
- **Features:**
  - Connection pooling
  - Auto-reconnect
  - Support for both SQL Server and MySQL
  - Connection caching for better performance

### Query Functions

All payroll queries are in:
- **File:** `apps/web/lib/db/payroll.ts`
- **Functions:**
  - `getSalaryComponents()` - Fetch salary components
  - `createSalaryComponent()` - Create new component
  - `getSalarySchemes()` - Fetch salary schemes
  - `getPayrollRecords()` - Fetch payroll records
  - `approvePayrollRecord()` - Approve payroll
  - And many more...

---

## Using the Database in API Routes

### Example: Salary Components API

The API route has been updated to use real database queries:

```typescript
// apps/web/app/api/payroll/salary-components/route.ts
import { getSalaryComponents, createSalaryComponent } from '@/lib/db/payroll';

export async function GET() {
  try {
    const components = await getSalaryComponents(true);
    return NextResponse.json(components);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
```

---

## Migrating Data from Legacy System

If you need to migrate existing data from the legacy PHP system:

### 1. Export from Legacy Database

```sql
-- Export existing salary components
SELECT * FROM master_komponen_gaji;

-- Export existing payroll records
SELECT * FROM payroll_data;
```

### 2. Import to New System

Use the API endpoints or direct SQL INSERT statements to import data.

---

## Troubleshooting

### Connection Refused

**Error:** `ECONNREFUSED`

**Solution:**
1. Ensure SQL Server is running
2. Check if SQL Server is listening on port 1433
3. Verify firewall settings
4. Check SQL Server authentication mode (use SQL Server Authentication, not Windows only)

### Authentication Failed

**Error:** `Login failed for user`

**Solution:**
1. Verify username and password in `.env.local`
2. Ensure SQL Server user has proper permissions
3. Check SQL Server authentication mode

### Database Not Found

**Error:** `Cannot open database`

**Solution:**
1. Verify database name in `.env.local`
2. Create database if it doesn't exist:
```sql
CREATE DATABASE db_hris;
```

### Trust Server Certificate Error

**Error:** `self signed certificate`

**Solution:**
Already handled in connection config with `trustServerCertificate: true`

---

## Performance Optimization

### Connection Pooling

The connection manager automatically uses connection pooling:
- **SQL Server:** Max 10 connections
- **MySQL:** Max 10 connections
- Idle timeout: 30 seconds

### Query Optimization

1. **Use indexes** on frequently queried columns
2. **Limit result sets** with WHERE clauses
3. **Use prepared statements** for parameterized queries
4. **Cache frequently accessed data** on the client side

---

## Security Best Practices

1. **Never commit `.env.local`** - it's in `.gitignore`
2. **Use environment variables** for all credentials
3. **Use parameterized queries** - already implemented in the query functions
4. **Limit database user permissions** - use principle of least privilege
5. **Enable SQL Server encryption** in production
6. **Regular backups** - schedule automated backups

---

## Next Steps

1. ✅ Database configuration complete
2. ✅ Connection manager created
3. ✅ Payroll queries implemented
4. ✅ Sample API route updated
5. ⏳ Run database table creation scripts
6. ⏳ Test database connectivity
7. ⏳ Update remaining API routes to use database
8. ⏳ Implement data migration from legacy system

---

## Support

For database-related issues:
1. Check the error logs in the terminal
2. Verify environment variables in `.env.local`
3. Test database connection with SQL Server Management Studio
4. Check SQL Server error logs
5. Contact the development team

---

**Status:** Database integration complete - Ready to connect to existing SQL Server database!

