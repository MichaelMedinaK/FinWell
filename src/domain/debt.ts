import { addMonths, daysBetween } from './dates';

export const ALERT_WINDOW_DAYS = 5;
const URGENT_THRESHOLD_DAYS = 2;

export const DEBT_TYPES = ['DEBT', 'CREDIT_CARD'] as const;
export type DebtType = (typeof DEBT_TYPES)[number];

export const DEBT_TYPE_LABELS: Record<DebtType, string> = {
  DEBT: 'Deuda',
  CREDIT_CARD: 'Tarjeta de crédito',
};

export function isDebtType(value: unknown): value is DebtType {
  return typeof value === 'string' && (DEBT_TYPES as readonly string[]).includes(value);
}

export function getDebtTypeLabel(type: string): string {
  return isDebtType(type) ? DEBT_TYPE_LABELS[type] : type;
}

export type DueStatus = 'overdue' | 'urgent' | 'soon' | 'ok';

export interface DueInfo {
  daysUntilDue: number;
  status: DueStatus;
}

export interface DebtRecord {
  id: string;
  name: string;
  type: string;
  totalAmount: number;
  remainingInstallments: number;
  interestRate: number | null;
  dueDate: Date;
}

export type DebtWithDueInfo<T extends DebtRecord = DebtRecord> = T & DueInfo;

export function classifyDueStatus(daysUntilDue: number): DueStatus {
  if (daysUntilDue < 0) return 'overdue';
  if (daysUntilDue <= URGENT_THRESHOLD_DAYS) return 'urgent';
  if (daysUntilDue <= ALERT_WINDOW_DAYS) return 'soon';
  return 'ok';
}

export function getDueInfo(dueDate: Date, referenceDay: Date): DueInfo {
  const daysUntilDue = daysBetween(referenceDay, dueDate);
  return { daysUntilDue, status: classifyDueStatus(daysUntilDue) };
}

export function withDueInfo<T extends DebtRecord>(debts: readonly T[], referenceDay: Date): DebtWithDueInfo<T>[] {
  return debts.map((debt) => ({ ...debt, ...getDueInfo(debt.dueDate, referenceDay) }));
}

/*
 * Incluye también las deudas ya vencidas: un pago atrasado requiere más atención
 * que uno próximo, por lo que no debe desaparecer del panel de avisos.
 */
export function selectDebtsNeedingAttention<T extends DebtRecord>(
  debts: readonly T[],
  referenceDay: Date,
  windowDays: number = ALERT_WINDOW_DAYS,
): DebtWithDueInfo<T>[] {
  return withDueInfo(debts, referenceDay)
    .filter((debt) => debt.daysUntilDue <= windowDays)
    .sort((first, second) => first.daysUntilDue - second.daysUntilDue);
}

export function estimateInstallmentAmount(debt: Pick<DebtRecord, 'totalAmount' | 'remainingInstallments'>): number {
  return debt.remainingInstallments > 0 ? debt.totalAmount / debt.remainingInstallments : debt.totalAmount;
}

export function sumOutstandingDebt(debts: readonly Pick<DebtRecord, 'totalAmount'>[]): number {
  return debts.reduce((total, debt) => total + debt.totalAmount, 0);
}

export interface DebtPaymentOutcome {
  totalAmount: number;
  remainingInstallments: number;
  dueDate: Date;
}

// El saldo adeudado baja con cada pago y el vencimiento pasa al mes siguiente mientras queden cuotas.
export function applyInstallmentPayment(debt: Pick<DebtRecord, 'totalAmount' | 'remainingInstallments' | 'dueDate'>, paidAmount: number): DebtPaymentOutcome {
  const remainingInstallments = Math.max(debt.remainingInstallments - 1, 0);
  return {
    totalAmount: Math.max(debt.totalAmount - paidAmount, 0),
    remainingInstallments,
    dueDate: remainingInstallments > 0 ? addMonths(debt.dueDate, 1) : debt.dueDate,
  };
}
