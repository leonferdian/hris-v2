/**
 * Database Configuration
 * Migrated from legacy PHP config (legacy/absensi/lib/config/database.php)
 */

export interface DatabaseConfig {
  driver: 'sqlsrv' | 'mysql';
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  charset?: string;
  collation?: string;
}

export const databaseConnections = {
  // SQL Server - Central Input
  sqlsrv_ci: {
    driver: 'sqlsrv' as const,
    host: '10.100.100.21',
    port: 1433,
    database: 'db_central_input',
    username: 'sa',
    password: 'padm4.4',
    charset: 'utf8',
    collation: 'utf8_unicode_ci',
  },

  // SQL Server - ILV
  sqlsrv_ilv: {
    driver: 'sqlsrv' as const,
    host: '10.100.100.20',
    port: 1433,
    database: 'db_ilv_padma',
    username: 'sa',
    password: 'padm4.4',
    charset: 'utf8',
    collation: 'utf8_unicode_ci',
  },

  // SQL Server - HRIS (Main Database for Payroll)
  // Primary: sqlsrv_hris from legacy config
  sqlsrv_hris: {
    driver: 'sqlsrv' as const,
    host: process.env.MSSQL_HOST || 'localhost',
    port: parseInt(process.env.MSSQL_PORT || '1433'),
    database: process.env.MSSQL_DB || 'db_hris',
    username: process.env.MSSQL_USER || 'hris1',
    password: process.env.MSSQL_PASSWORD || 'P4dma_hris',
    charset: 'utf8',
    collation: 'utf8_unicode_ci',
  },

  // SQL Server - HRIS Admin (Payroll Database)
  // Primary: sqlsrv_hris_admin from legacy config
  sqlsrv_hris_admin: {
    driver: 'sqlsrv' as const,
    host: process.env.MSSQL_PAYROLL_HOST || process.env.MSSQL_HOST || 'localhost',
    port: parseInt(process.env.MSSQL_PAYROLL_PORT || process.env.MSSQL_PORT || '1433'),
    database: process.env.MSSQL_PAYROLL_DB || 'db_payroll',
    username: process.env.MSSQL_PAYROLL_USER || 'sa',
    password: process.env.MSSQL_PAYROLL_PASSWORD || 'padm4.4',
    charset: 'utf8',
    collation: 'utf8_unicode_ci',
  },

  // MySQL - ILV Dashboard
  mysql_ilv: {
    driver: 'mysql' as const,
    host: '10.100.100.20',
    port: 3306,
    database: 'dashboard_ilv',
    username: 'iwan',
    password: 'i021172sIS',
    charset: 'utf8',
    collation: 'utf8_unicode_ci',
  },

  // MySQL - FTM
  mysql_ftm: {
    driver: 'mysql' as const,
    host: '10.50.1.22',
    port: 3306,
    database: 'ftm',
    username: 'it',
    password: 'it.45',
    charset: 'utf8',
    collation: 'utf8_unicode_ci',
  },

  // MySQL - Finance Pro
  mysql_fp: {
    driver: 'mysql' as const,
    host: '10.50.1.23',
    port: 3308,
    database: 'fin_pro',
    username: 'it',
    password: 'it.45',
    charset: 'utf8',
    collation: 'utf8_unicode_ci',
  },

  // MySQL - HRIS Dashboard (for users and menu system)
  // Primary: mysql_hris from legacy config
  mysql_hris: {
    driver: 'mysql' as const,
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    database: process.env.MYSQL_DB || 'dashboard_hris',
    username: process.env.MYSQL_USER || 'it',
    password: process.env.MYSQL_PASSWORD || 'padm4.4',
    charset: 'utf8',
    collation: 'utf8_unicode_ci',
  },
} as const;

export type ConnectionName = keyof typeof databaseConnections;

// Security parameter from legacy config
export const SCRAMBLER = 'PadmaTiRt4';

// Helper function to get working days (migrated from Config class)
export async function getHariKerja(tahun: string, bulan: string): Promise<string> {
  // TODO: Implement with actual database query
  // SELECT * FROM [db_hris].[dbo].[table_master_hari_kerja] 
  // WHERE [tahun] = @tahun and [bulan] = @bulan
  return '25'; // default value
}

