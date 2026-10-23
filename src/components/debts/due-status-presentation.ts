import type { DueStatus } from '@/domain/debt';

export const DUE_STATUS_STYLES: Record<DueStatus, { badge: string; accent: string }> = {
  overdue: { badge: 'bg-red-100 text-red-700 ring-red-200', accent: 'border-l-red-500' },
  urgent: { badge: 'bg-orange-100 text-orange-700 ring-orange-200', accent: 'border-l-orange-500' },
  soon: { badge: 'bg-amber-100 text-amber-800 ring-amber-200', accent: 'border-l-amber-400' },
  ok: { badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200', accent: 'border-l-emerald-400' },
};

export function describeDaysUntilDue(daysUntilDue: number): string {
  if (daysUntilDue < -1) return `Vencida hace ${Math.abs(daysUntilDue)} días`;
  if (daysUntilDue === -1) return 'Venció ayer';
  if (daysUntilDue === 0) return 'Vence hoy';
  if (daysUntilDue === 1) return 'Vence mañana';
  return `Vence en ${daysUntilDue} días`;
}
