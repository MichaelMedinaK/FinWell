import bcrypt from 'bcryptjs';

// 12 rondas: costo recomendado actualmente para bcrypt sin penalizar demasiado el login.
const BCRYPT_ROUNDS = 12;

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}
