import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

export interface JWTPayload {
  userId: string;
  username: string;
  email?: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export function signJwt(payload: Omit<JWTPayload, 'iat' | 'exp'>, expiresIn: string = '7d'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyJwt(token: string | undefined): JWTPayload | null {
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

export function decodeJwt(token: string): JWTPayload | null {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('JWT decoding failed:', error);
    return null;
  }
}
