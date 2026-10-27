// Ventana corta: el enlace llega por correo y da acceso total a la cuenta.
export const PASSWORD_RESET_TTL_MINUTES = 60;

const MS_PER_MINUTE = 60_000;

export function computeResetExpiry(now: Date): Date {
  return new Date(now.getTime() + PASSWORD_RESET_TTL_MINUTES * MS_PER_MINUTE);
}

export function isResetTokenExpired(expiresAt: Date, now: Date): boolean {
  return expiresAt.getTime() <= now.getTime();
}
