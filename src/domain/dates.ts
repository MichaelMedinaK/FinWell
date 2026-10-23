const MS_PER_DAY = 86_400_000;
const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/*
 * Las fechas de negocio (vencimientos, movimientos) son "solo día". Se normalizan a
 * medianoche UTC para que el día no se desplace según la zona horaria del servidor o navegador.
 */
export function toDateOnly(date: Date): Date {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

export function today(): Date {
  return toDateOnly(new Date());
}

export function parseDateOnly(value: string): Date | null {
  const match = DATE_ONLY_PATTERN.exec(value.trim());
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  const isRealCalendarDate =
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  return isRealCalendarDate ? date : null;
}

export function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function toMonthKey(date: Date): string {
  return date.toISOString().slice(0, 7);
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

export function startOfMonthOffset(date: Date, monthOffset: number): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + monthOffset, 1));
}

export function fullYearsBetween(from: Date, to: Date): number {
  const years = to.getUTCFullYear() - from.getUTCFullYear();
  const hasReachedAnniversary =
    to.getUTCMonth() > from.getUTCMonth() ||
    (to.getUTCMonth() === from.getUTCMonth() && to.getUTCDate() >= from.getUTCDate());
  return hasReachedAnniversary ? years : years - 1;
}

export function daysBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / MS_PER_DAY);
}
