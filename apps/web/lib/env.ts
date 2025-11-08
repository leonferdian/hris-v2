type RequiredKey =
  | 'JWT_SECRET'
  | 'MYSQL_HOST'
  | 'MYSQL_PORT'
  | 'MYSQL_DB'
  | 'MYSQL_USER'
  | 'MYSQL_PASSWORD'
  | 'MSSQL_HOST'
  | 'MSSQL_PORT'
  | 'MSSQL_DB'
  | 'MSSQL_USER'
  | 'MSSQL_PASSWORD';

export type AppEnv = {
  JWT_SECRET: string;
  LEGACY_SCRAMBLER: string;
  MYSQL_HOST: string;
  MYSQL_PORT: number;
  MYSQL_DB: string;
  MYSQL_USER: string;
  MYSQL_PASSWORD: string;
  MSSQL_HOST: string;
  MSSQL_PORT: number;
  MSSQL_DB: string;
  MSSQL_USER: string;
  MSSQL_PASSWORD: string;
};

let cachedEnv: AppEnv | null = null;

export function getEnv(): AppEnv {
  if (cachedEnv) {
    return cachedEnv;
  }

  const required: RequiredKey[] = [
    'JWT_SECRET',
    'MYSQL_HOST',
    'MYSQL_PORT',
    'MYSQL_DB',
    'MYSQL_USER',
    'MYSQL_PASSWORD',
    'MSSQL_HOST',
    'MSSQL_PORT',
    'MSSQL_DB',
    'MSSQL_USER',
    'MSSQL_PASSWORD',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  cachedEnv = {
    JWT_SECRET: process.env.JWT_SECRET!,
    LEGACY_SCRAMBLER: process.env.LEGACY_SCRAMBLER ?? 'PadmaTiRt4',
    MYSQL_HOST: process.env.MYSQL_HOST!,
    MYSQL_PORT: Number(process.env.MYSQL_PORT),
    MYSQL_DB: process.env.MYSQL_DB!,
    MYSQL_USER: process.env.MYSQL_USER!,
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD!,
    MSSQL_HOST: process.env.MSSQL_HOST!,
    MSSQL_PORT: Number(process.env.MSSQL_PORT),
    MSSQL_DB: process.env.MSSQL_DB!,
    MSSQL_USER: process.env.MSSQL_USER!,
    MSSQL_PASSWORD: process.env.MSSQL_PASSWORD!,
  } satisfies AppEnv;

  return cachedEnv;
}

