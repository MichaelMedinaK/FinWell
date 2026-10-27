import { prisma } from '@/lib/prisma';
import { computeResetExpiry, isResetTokenExpired } from '@/domain/password-reset';
import { generateResetToken, hashResetToken } from '@/server/auth/reset-token';

// Un solo enlace vigente por usuario: pedir uno nuevo invalida el anterior.
export async function createPasswordResetToken(userId: string, now: Date = new Date()): Promise<string> {
  const { token, tokenHash } = generateResetToken();
  await prisma.$transaction([
    prisma.passwordResetToken.deleteMany({ where: { userId } }),
    prisma.passwordResetToken.create({ data: { userId, tokenHash, expiresAt: computeResetExpiry(now) } }),
  ]);
  return token;
}

export async function isPasswordResetTokenUsable(token: string, now: Date = new Date()): Promise<boolean> {
  if (token === '') return false;
  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash: hashResetToken(token) } });
  return record !== null && !isResetTokenExpired(record.expiresAt, now);
}

export async function resetPasswordWithToken(
  token: string,
  newPasswordHash: string,
  now: Date = new Date(),
): Promise<boolean> {
  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash: hashResetToken(token) } });
  if (!record || isResetTokenExpired(record.expiresAt, now)) return false;

  return prisma.$transaction(async (transaction) => {
    // Borrar primero hace el enlace de un solo uso aunque lleguen dos solicitudes a la vez.
    const { count } = await transaction.passwordResetToken.deleteMany({ where: { id: record.id } });
    if (count === 0) return false;

    await transaction.user.update({ where: { id: record.userId }, data: { passwordHash: newPasswordHash } });
    await transaction.passwordResetToken.deleteMany({ where: { userId: record.userId } });
    return true;
  });
}
