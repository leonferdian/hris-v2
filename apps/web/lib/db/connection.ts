/**
 * Database Connection Manager
 * Supports both SQL Server and MySQL connections
 * Migrated from legacy PHP (legacy/absensi/lib/database.php)
 */

import sql from 'mssql';
import mysql from 'mysql2/promise';
import { databaseConnections, ConnectionName, DatabaseConfig } from './config';

// SQL Server connection pool cache
const sqlServerPools = new Map<string, sql.ConnectionPool>();

// MySQL connection pool cache
const mysqlPools = new Map<string, mysql.Pool>();

/**
 * Get SQL Server connection pool
 */
export async function getSqlServerConnection(connectionName: ConnectionName): Promise<sql.ConnectionPool> {
  const config = databaseConnections[connectionName];
  
  if (config.driver !== 'sqlsrv') {
    throw new Error(`Connection ${connectionName} is not a SQL Server connection`);
  }

  // Return cached pool if exists
  if (sqlServerPools.has(connectionName)) {
    const pool = sqlServerPools.get(connectionName)!;
    if (pool.connected) {
      return pool;
    }
  }

  // Create new connection pool
  const poolConfig: sql.config = {
    server: config.host,
    port: config.port,
    database: config.database,
    user: config.username,
    password: config.password,
    options: {
      encrypt: false, // Use true if you're on Azure
      trustServerCertificate: true,
      enableArithAbort: true,
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  };

  const pool = await sql.connect(poolConfig);
  sqlServerPools.set(connectionName, pool);
  
  return pool;
}

/**
 * Get MySQL connection pool
 */
export function getMySQLConnection(connectionName: ConnectionName): mysql.Pool {
  const config = databaseConnections[connectionName];
  
  if (config.driver !== 'mysql') {
    throw new Error(`Connection ${connectionName} is not a MySQL connection`);
  }

  // Return cached pool if exists
  if (mysqlPools.has(connectionName)) {
    return mysqlPools.get(connectionName)!;
  }

  // Create new connection pool
  const pool = mysql.createPool({
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.username,
    password: config.password,
    charset: config.charset,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  mysqlPools.set(connectionName, pool);
  
  return pool;
}

/**
 * Get connection (auto-detect driver type)
 */
export async function getConnection(connectionName: ConnectionName) {
  const config = databaseConnections[connectionName];
  
  if (config.driver === 'sqlsrv') {
    return getSqlServerConnection(connectionName);
  } else {
    return getMySQLConnection(connectionName);
  }
}

/**
 * Execute SQL Server query
 */
export async function querySqlServer<T = any>(
  connectionName: ConnectionName,
  query: string,
  params?: Record<string, any>
): Promise<sql.IResult<T>> {
  const pool = await getSqlServerConnection(connectionName);
  const request = pool.request();
  
  // Add parameters if provided
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });
  }
  
  return request.query(query);
}

/**
 * Execute MySQL query
 */
export async function queryMySQL<T = any>(
  connectionName: ConnectionName,
  query: string,
  params?: any[]
): Promise<[T[], mysql.FieldPacket[]]> {
  const pool = getMySQLConnection(connectionName);
  return pool.query<T[]>(query, params);
}

/**
 * Close all connections (use for cleanup)
 */
export async function closeAllConnections(): Promise<void> {
  // Close SQL Server pools
  for (const pool of sqlServerPools.values()) {
    await pool.close();
  }
  sqlServerPools.clear();
  
  // Close MySQL pools
  for (const pool of mysqlPools.values()) {
    await pool.end();
  }
  mysqlPools.clear();
}

/**
 * Utility function to safely close connections on server shutdown
 */
if (typeof process !== 'undefined') {
  process.on('beforeExit', async () => {
    await closeAllConnections();
  });
}

// Export connection names for convenience
export { ConnectionName };
export { databaseConnections };

