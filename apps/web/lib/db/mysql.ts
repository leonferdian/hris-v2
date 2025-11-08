import type { Pool, PoolConnection } from 'mysql2/promise';
import mysql from 'mysql2/promise';
import { getEnv } from '@/lib/env';

let pool: Pool | null = null;

export function getMysqlPool(): Pool {
  if (!pool) {
    const env = getEnv();
    pool = mysql.createPool({
      host: env.MYSQL_HOST,
      port: env.MYSQL_PORT,
      user: env.MYSQL_USER,
      password: env.MYSQL_PASSWORD,
      database: env.MYSQL_DB,
      connectionLimit: 10,
      waitForConnections: true,
      decimalNumbers: true,
      dateStrings: true,
    });
  }

  return pool;
}

export async function withMysqlConnection<T>(callback: (connection: PoolConnection) => Promise<T>): Promise<T> {
  const connection = await getMysqlPool().getConnection();
  try {
    return await callback(connection);
  } finally {
    connection.release();
  }
}

