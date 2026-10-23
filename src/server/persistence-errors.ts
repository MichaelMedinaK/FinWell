import { Prisma } from '@prisma/client';

export const PERSISTENCE_ERROR_MESSAGE = 'No pudimos guardar los datos. Intenta nuevamente.';

export function isPersistenceError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientValidationError
  );
}
