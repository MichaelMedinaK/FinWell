import { Prisma } from '@prisma/client';

export const PERSISTENCE_ERROR_MESSAGE = 'No pudimos guardar los datos. Intenta nuevamente.';

export function isPersistenceError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientValidationError
  );
}

const UNIQUE_CONSTRAINT_ERROR_CODE = 'P2002';

export function isUniqueConstraintError(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === UNIQUE_CONSTRAINT_ERROR_CODE;
}
