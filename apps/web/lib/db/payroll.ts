/**
 * Payroll Database Queries
 * SQL Server queries for payroll system
 * Uses db_hris database (sqlsrv_hris connection)
 */

import { querySqlServer } from './connection';
import sql from 'mssql';

// Main connection for HRIS/Payroll data
const HRIS_CONNECTION = 'sqlsrv_hris';

/**
 * Salary Components
 */
export async function getSalaryComponents(isActive?: boolean) {
  let query = `
    SELECT 
      id,
      code,
      name,
      type,
      description,
      is_active,
      created_at,
      updated_at
    FROM [db_hris].[dbo].[master_komponen_gaji]
  `;
  
  if (isActive !== undefined) {
    query += ` WHERE is_active = @isActive`;
  }
  
  query += ` ORDER BY code ASC`;
  
  const result = await querySqlServer(
    HRIS_CONNECTION,
    query,
    isActive !== undefined ? { isActive } : undefined
  );
  
  return result.recordset;
}

export async function createSalaryComponent(data: {
  code: string;
  name: string;
  type: 'allowance' | 'deduction';
  description?: string;
}) {
  const query = `
    INSERT INTO [db_hris].[dbo].[master_komponen_gaji] 
      (code, name, type, description, is_active, created_at, updated_at)
    VALUES 
      (@code, @name, @type, @description, 1, GETDATE(), GETDATE());
    SELECT SCOPE_IDENTITY() AS id;
  `;
  
  const result = await querySqlServer(HRIS_CONNECTION, query, data);
  return result.recordset[0];
}

export async function deleteSalaryComponent(id: string) {
  const query = `
    DELETE FROM [db_hris].[dbo].[master_komponen_gaji]
    WHERE id = @id
  `;
  
  await querySqlServer(HRIS_CONNECTION, query, { id });
}

/**
 * Salary Schemes
 */
export async function getSalarySchemes(isActive?: boolean) {
  let query = `
    SELECT 
      s.id,
      s.code,
      s.name,
      s.basic_salary,
      s.is_active,
      s.created_at,
      s.updated_at,
      (
        SELECT 
          sc.id,
          sc.component_id,
          c.name as component_name,
          sc.amount
        FROM [db_hris].[dbo].[salary_scheme_components] sc
        INNER JOIN [db_hris].[dbo].[master_komponen_gaji] c ON sc.component_id = c.id
        WHERE sc.scheme_id = s.id
        FOR JSON PATH
      ) as components
    FROM [db_hris].[dbo].[master_skema_gaji] s
  `;
  
  if (isActive !== undefined) {
    query += ` WHERE s.is_active = @isActive`;
  }
  
  query += ` ORDER BY s.code ASC`;
  
  const result = await querySqlServer(
    HRIS_CONNECTION,
    query,
    isActive !== undefined ? { isActive } : undefined
  );
  
  return result.recordset.map(row => ({
    ...row,
    components: row.components ? JSON.parse(row.components) : []
  }));
}

export async function createSalaryScheme(data: {
  code: string;
  name: string;
  basicSalary: number;
}) {
  const query = `
    INSERT INTO [db_hris].[dbo].[master_skema_gaji]
      (code, name, basic_salary, is_active, created_at, updated_at)
    VALUES
      (@code, @name, @basicSalary, 1, GETDATE(), GETDATE());
    SELECT SCOPE_IDENTITY() AS id;
  `;
  
  const result = await querySqlServer(HRIS_CONNECTION, query, data);
  return result.recordset[0];
}

/**
 * Payroll Periods
 */
export async function getPayrollPeriods(status?: string) {
  let query = `
    SELECT 
      id,
      name,
      start_date,
      end_date,
      cutoff_date,
      payment_date,
      status,
      created_at,
      updated_at
    FROM [db_hris].[dbo].[payroll_periods]
  `;
  
  if (status) {
    query += ` WHERE status = @status`;
  }
  
  query += ` ORDER BY start_date DESC`;
  
  const result = await querySqlServer(
    HRIS_CONNECTION,
    query,
    status ? { status } : undefined
  );
  
  return result.recordset;
}

export async function createPayrollPeriod(data: {
  name: string;
  startDate: string;
  endDate: string;
  cutoffDate: string;
  paymentDate: string;
}) {
  const query = `
    INSERT INTO [db_hris].[dbo].[payroll_periods]
      (name, start_date, end_date, cutoff_date, payment_date, status, created_at, updated_at)
    VALUES
      (@name, @startDate, @endDate, @cutoffDate, @paymentDate, 'draft', GETDATE(), GETDATE());
    SELECT SCOPE_IDENTITY() AS id;
  `;
  
  const result = await querySqlServer(HRIS_CONNECTION, query, data);
  return result.recordset[0];
}

export async function updatePeriodStatus(id: string, status: string) {
  const query = `
    UPDATE [db_hris].[dbo].[payroll_periods]
    SET status = @status, updated_at = GETDATE()
    WHERE id = @id
  `;
  
  await querySqlServer(HRIS_CONNECTION, query, { id, status });
}

/**
 * Payroll Records
 */
export async function getPayrollRecords(periodId?: string) {
  let query = `
    SELECT 
      p.id,
      p.employee_id,
      e.nik as employee_nik,
      e.nama as employee_name,
      p.period_id,
      per.name as period_name,
      p.basic_salary,
      p.allowances,
      p.overtime,
      p.incentives,
      p.deductions,
      p.net_salary,
      p.status,
      p.approved_by,
      p.approved_at,
      p.created_at
    FROM [db_hris].[dbo].[payroll_records] p
    INNER JOIN [db_hris].[dbo].[table_karyawan] e ON p.employee_id = e.id
    INNER JOIN [db_hris].[dbo].[payroll_periods] per ON p.period_id = per.id
  `;
  
  if (periodId) {
    query += ` WHERE p.period_id = @periodId`;
  }
  
  query += ` ORDER BY e.nama ASC`;
  
  const result = await querySqlServer(
    HRIS_CONNECTION,
    query,
    periodId ? { periodId } : undefined
  );
  
  return result.recordset;
}

export async function approvePayrollRecord(id: string, approvedBy: string) {
  const query = `
    UPDATE [db_hris].[dbo].[payroll_records]
    SET 
      status = 'approved',
      approved_by = @approvedBy,
      approved_at = GETDATE(),
      updated_at = GETDATE()
    WHERE id = @id
  `;
  
  await querySqlServer(HRIS_CONNECTION, query, { id, approvedBy });
}

/**
 * Employee Salary Schemes
 */
export async function getEmployeeSalarySchemes(search?: string) {
  let query = `
    SELECT 
      es.id,
      es.employee_id,
      e.nik as employee_nik,
      e.nama as employee_name,
      es.scheme_id,
      s.name as scheme_name,
      s.basic_salary,
      es.effective_date,
      es.is_active
    FROM [db_hris].[dbo].[employee_salary_schemes] es
    INNER JOIN [db_hris].[dbo].[table_karyawan] e ON es.employee_id = e.id
    INNER JOIN [db_hris].[dbo].[master_skema_gaji] s ON es.scheme_id = s.id
  `;
  
  if (search) {
    query += ` WHERE e.nama LIKE @search OR e.nik LIKE @search`;
  }
  
  query += ` ORDER BY e.nama ASC`;
  
  const result = await querySqlServer(
    HRIS_CONNECTION,
    query,
    search ? { search: `%${search}%` } : undefined
  );
  
  return result.recordset;
}

/**
 * BPJS Deductions
 */
export async function getBPJSDeductions(search?: string) {
  let query = `
    SELECT 
      b.id,
      b.employee_id,
      e.nik as employee_nik,
      e.nama as employee_name,
      b.bpjs_kesehatan_number,
      b.bpjs_kesehatan_amount,
      b.bpjs_ketenagakerjaan_number,
      b.bpjs_ketenagakerjaan_amount,
      (b.bpjs_kesehatan_amount + b.bpjs_ketenagakerjaan_amount) as total_deduction,
      b.is_active
    FROM [db_hris].[dbo].[bpjs_deductions] b
    INNER JOIN [db_hris].[dbo].[table_karyawan] e ON b.employee_id = e.id
  `;
  
  if (search) {
    query += ` WHERE e.nama LIKE @search OR e.nik LIKE @search`;
  }
  
  query += ` ORDER BY e.nama ASC`;
  
  const result = await querySqlServer(
    HRIS_CONNECTION,
    query,
    search ? { search: `%${search}%` } : undefined
  );
  
  return result.recordset;
}

/**
 * Late Tolerance Rules
 */
export async function getLateToleranceRules(isActive?: boolean) {
  let query = `
    SELECT 
      id,
      name,
      min_minutes,
      max_minutes,
      deduction_type,
      deduction_amount,
      is_active,
      created_at
    FROM [db_hris].[dbo].[late_tolerance_rules]
  `;
  
  if (isActive !== undefined) {
    query += ` WHERE is_active = @isActive`;
  }
  
  query += ` ORDER BY min_minutes ASC`;
  
  const result = await querySqlServer(
    HRIS_CONNECTION,
    query,
    isActive !== undefined ? { isActive } : undefined
  );
  
  return result.recordset;
}

/**
 * Reports by Depot
 */
export async function getPayrollReportByDepo(period: string) {
  const query = `
    SELECT 
      d.id as depo_id,
      d.nama as depo_name,
      d.lokasi as depo_location,
      COUNT(DISTINCT p.employee_id) as employee_count,
      SUM(p.basic_salary) as total_basic_salary,
      SUM(p.allowances) as total_allowances,
      SUM(p.deductions) as total_deductions,
      SUM(p.net_salary) as net_payroll
    FROM [db_hris].[dbo].[payroll_records] p
    INNER JOIN [db_hris].[dbo].[table_karyawan] e ON p.employee_id = e.id
    INNER JOIN [db_hris].[dbo].[master_depo] d ON e.depo_id = d.id
    INNER JOIN [db_hris].[dbo].[payroll_periods] per ON p.period_id = per.id
    WHERE per.name = @period
    GROUP BY d.id, d.nama, d.lokasi
    ORDER BY d.nama ASC
  `;
  
  const result = await querySqlServer(HRIS_CONNECTION, query, { period });
  return result.recordset;
}

/**
 * Get employee list for dropdowns
 */
export async function getEmployees(isActive: boolean = true) {
  const query = `
    SELECT 
      id,
      nik,
      nama as name,
      depo_id,
      jabatan as position
    FROM [db_hris].[dbo].[table_karyawan]
    WHERE status_karyawan = @isActive
    ORDER BY nama ASC
  `;
  
  const result = await querySqlServer(HRIS_CONNECTION, query, { isActive });
  return result.recordset;
}

