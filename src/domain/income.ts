export const INCOME_KINDS = ['FIXED', 'VARIABLE'] as const;
export type IncomeKind = (typeof INCOME_KINDS)[number];

export const INCOME_KIND_LABELS: Record<IncomeKind, string> = {
  FIXED: 'Fijo',
  VARIABLE: 'Informal / variable',
};

export const INCOME_KIND_HINTS: Record<IncomeKind, string> = {
  FIXED: 'Llega todos los meses por el mismo monto (sueldo, pensión, arriendo).',
  VARIABLE: 'Cambia mes a mes (pololos, ventas, propinas). Ingresa tu promedio.',
};

export const INCOME_ORIGINS = ['EMPLOYMENT', 'BUSINESS', 'FREELANCE', 'RENTAL', 'BENEFIT', 'OTHER'] as const;
export type IncomeOrigin = (typeof INCOME_ORIGINS)[number];

export const INCOME_ORIGIN_LABELS: Record<IncomeOrigin, string> = {
  EMPLOYMENT: 'Sueldo / empleo',
  BUSINESS: 'Negocio propio',
  FREELANCE: 'Trabajos independientes',
  RENTAL: 'Arriendos',
  BENEFIT: 'Pensión / subsidio',
  OTHER: 'Otro',
};

export interface IncomeSourceAmount {
  kind: IncomeKind;
  monthlyAmount: number;
}

export function isIncomeKind(value: string): value is IncomeKind {
  return (INCOME_KINDS as readonly string[]).includes(value);
}

export function isIncomeOrigin(value: string): value is IncomeOrigin {
  return (INCOME_ORIGINS as readonly string[]).includes(value);
}

export function sumMonthlyIncome(sources: readonly IncomeSourceAmount[], kind?: IncomeKind): number {
  return sources
    .filter((source) => kind === undefined || source.kind === kind)
    .reduce((total, source) => total + source.monthlyAmount, 0);
}

// Null cuando no hay fuentes: distingue "no declaró ingresos" de "ingresos en cero".
export function totalMonthlyIncomeOrNull(sources: readonly IncomeSourceAmount[]): number | null {
  return sources.length === 0 ? null : sumMonthlyIncome(sources);
}
