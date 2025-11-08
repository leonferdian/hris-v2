import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import type { RowDataPacket } from 'mysql2/promise';
import { getEnv } from '@/lib/env';
import { getMysqlPool } from '@/lib/db/mysql';

export type LegacyUser = RowDataPacket & {
  id_user: number;
  username: string;
  nama: string;
  email?: string | null;
  password: string;
};

export type PublicLegacyUser = Omit<LegacyUser, 'password'>;

const env = () => getEnv();

function md5(value: string) {
  return crypto.createHash('md5').update(value).digest('hex');
}

async function findLegacyUser(username: string): Promise<LegacyUser | null> {
  try {
    console.log('🔍 Searching for user:', username);
    const pool = getMysqlPool();
    console.log('📊 MySQL Pool created, querying database...');
    
    const [rows] = await pool.query<LegacyUser[]>(
      'SELECT id_user, username, nama, password FROM user WHERE username = ? LIMIT 1', 
      [username]
    );
    
    console.log('✅ Query executed, rows found:', Array.isArray(rows) ? rows.length : 0);
    if (Array.isArray(rows) && rows.length > 0) {
      console.log('✅ User found:', { id: rows[0].id_user, username: rows[0].username });
    } else {
      console.log('❌ User not found:', username);
    }
    
    return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('❌ Database error in findLegacyUser:', error);
    throw error;
  }
}

export async function verifyLegacyUser(username: string, password: string): Promise<LegacyUser | null> {
  try {
    const scrambler = env().LEGACY_SCRAMBLER;
    console.log('🔐 Verifying password with scrambler:', scrambler);
    
    const user = await findLegacyUser(username);

    if (!user) {
      console.log('❌ User not found');
      return null;
    }

    const hash = md5(password);
    const legacy = md5(`${scrambler}${hash}${scrambler}`);
    
    console.log('🔐 Password verification:', {
      storedHash: user.password.substring(0, 10) + '...',
      calculatedHash: legacy.substring(0, 10) + '...',
      match: user.password === legacy
    });

    return user.password === legacy ? user : null;
  } catch (error) {
    console.error('❌ Error in verifyLegacyUser:', error);
    throw error;
  }
}

export function issueJwt(user: LegacyUser): string {
  const secret = env().JWT_SECRET;

  return jwt.sign(
    {
      sub: user.id_user,
      username: user.username,
      nama: user.nama,
      email: user.email ?? undefined,
    },
    secret,
    { expiresIn: '12h' },
  );
}

export function sanitizeLegacyUser(user: LegacyUser): PublicLegacyUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = user;
  return rest;
}

