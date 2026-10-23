import { estimateInstallmentAmount, type DebtRecord } from './debt';

/*
 * Umbrales de carga financiera (cuotas mensuales / ingreso mensual) usados como referencia
 * habitual por la banca: hasta 30% se considera sano y desde 50% compromete el presupuesto.
 */
const HEALTHY_MAX_PERCENT = 30;
const MODERATE_MAX_PERCENT = 50;

export type DebtLoadLevel = 'healthy' | 'moderate' | 'high';

type InstallmentSource = Pick<DebtRecord, 'totalAmount' | 'remainingInstallments'>;

export function sumMonthlyInstallments(debts: readonly InstallmentSource[]): number {
  return debts.reduce((total, debt) => total + estimateInstallmentAmount(debt), 0);
}

export function calculateDebtLoadPercent(monthlyInstallments: number, monthlyIncome: number | null): number | null {
  if (monthlyIncome === null || monthlyIncome <= 0) return null;
  return (monthlyInstallments / monthlyIncome) * 100;
}

export function classifyDebtLoad(debtLoadPercent: number): DebtLoadLevel {
  if (debtLoadPercent < HEALTHY_MAX_PERCENT) return 'healthy';
  if (debtLoadPercent < MODERATE_MAX_PERCENT) return 'moderate';
  return 'high';
}
