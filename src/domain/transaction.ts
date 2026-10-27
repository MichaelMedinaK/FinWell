import { addDays, startOfMonthOffset, toDateKey, toMonthKey } from './dates';

export const TRANSACTION_TYPES = ['INCOME', 'EXPENSE'] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  INCOME: 'Entrada',
  EXPENSE: 'Salida',
};

export function isTransactionType(value: unknown): value is TransactionType {
  return typeof value === 'string' && (TRANSACTION_TYPES as readonly string[]).includes(value);
}

export const TRANSACTION_SUBTYPES = {
  EXPENSE: ['DAILY', 'DEBT_PAYMENT', 'FIXED', 'OTHER'],
  INCOME: ['FIXED', 'VARIABLE', 'OTHER'],
} as const satisfies Record<TransactionType, readonly string[]>;

export const TRANSACTION_SUBTYPE_LABELS: Record<TransactionType, Record<string, string>> = {
  EXPENSE: {
    DAILY: 'Gasto diario',
    DEBT_PAYMENT: 'Pago de deuda agendada',
    FIXED: 'Gasto fijo (luz, agua, arriendo…)',
    OTHER: 'Otro gasto',
  },
  INCOME: {
    FIXED: 'Ingreso fijo (sueldo)',
    VARIABLE: 'Ingreso informal / variable',
    OTHER: 'Otro ingreso',
  },
};

export const DEBT_PAYMENT_SUBTYPE = 'DEBT_PAYMENT';

export function isSubtypeOf(type: TransactionType, subtype: string): boolean {
  return (TRANSACTION_SUBTYPES[type] as readonly string[]).includes(subtype);
}

export interface TransactionRecord {
  type: string;
  amount: number;
  date: Date;
}

export interface FlowTotals {
  income: number;
  expense: number;
  net: number;
}

export interface PeriodFlow extends FlowTotals {
  key: string;
  start: Date;
}

export interface FinancialSummary {
  today: FlowTotals;
  month: FlowTotals;
}

export function sumFlows(transactions: readonly TransactionRecord[]): FlowTotals {
  let income = 0;
  let expense = 0;
  for (const transaction of transactions) {
    if (transaction.type === 'INCOME') income += transaction.amount;
    else if (transaction.type === 'EXPENSE') expense += transaction.amount;
  }
  return { income, expense, net: income - expense };
}

function groupByKey<T extends TransactionRecord>(transactions: readonly T[], toKey: (date: Date) => string): Map<string, T[]> {
  const groups = new Map<string, T[]>();
  for (const transaction of transactions) {
    const key = toKey(transaction.date);
    groups.set(key, [...(groups.get(key) ?? []), transaction]);
  }
  return groups;
}

export function summarizePeriod(transactions: readonly TransactionRecord[], referenceDay: Date): FinancialSummary {
  const dayKey = toDateKey(referenceDay);
  const monthKey = toMonthKey(referenceDay);
  return {
    today: sumFlows(transactions.filter((transaction) => toDateKey(transaction.date) === dayKey)),
    month: sumFlows(transactions.filter((transaction) => toMonthKey(transaction.date) === monthKey)),
  };
}

export function buildDailyFlows(transactions: readonly TransactionRecord[], referenceDay: Date, days = 7): PeriodFlow[] {
  const groups = groupByKey(transactions, toDateKey);
  return Array.from({ length: days }, (_, index) => {
    const start = addDays(referenceDay, index - (days - 1));
    const key = toDateKey(start);
    return { key, start, ...sumFlows(groups.get(key) ?? []) };
  });
}

export function buildMonthlyFlows(transactions: readonly TransactionRecord[], referenceDay: Date, months = 6): PeriodFlow[] {
  const groups = groupByKey(transactions, toMonthKey);
  return Array.from({ length: months }, (_, index) => {
    const start = startOfMonthOffset(referenceDay, index - (months - 1));
    const key = toMonthKey(start);
    return { key, start, ...sumFlows(groups.get(key) ?? []) };
  });
}
