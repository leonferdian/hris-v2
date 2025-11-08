import sql, { ConnectionPool } from 'mssql';
import { getEnv } from '@/lib/env';

let pool: ConnectionPool | null = null;

export async function getMssqlPool(): Promise<ConnectionPool> {
  if (pool) {
    return pool;
  }

  const env = getEnv();

  pool = await sql.connect({
    server: env.MSSQL_HOST,
    port: env.MSSQL_PORT,
    authentication: {
      type: 'default',
      options: {
        userName: env.MSSQL_USER,
        password: env.MSSQL_PASSWORD,
      },
    },
    options: {
      database: env.MSSQL_DB,
      encrypt: false,
      trustServerCertificate: true,
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  });

  pool.on('error', () => {
    pool = null;
  });

  return pool;
}

export async function closeMssqlPool() {
  if (pool) {
    await pool.close();
    pool = null;
  }
}

