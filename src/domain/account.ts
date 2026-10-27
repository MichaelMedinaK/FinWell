export const ACCOUNT_KINDS = ['BANK', 'WALLET', 'CASH', 'OTHER'] as const;
export type AccountKind = (typeof ACCOUNT_KINDS)[number];

export const ACCOUNT_KIND_LABELS: Record<AccountKind, string> = {
  BANK: 'Cuenta bancaria',
  WALLET: 'Billetera digital (Mercado Pago, etc.)',
  CASH: 'Efectivo / dinero físico',
  OTHER: 'Otra',
};

const CURRENCY_CODE_PATTERN = /^[A-Z]{3}$/;

export function isAccountKind(value: unknown): value is AccountKind {
  return typeof value === 'string' && (ACCOUNT_KINDS as readonly string[]).includes(value);
}

export function isCurrencyCode(value: unknown): value is string {
  return typeof value === 'string' && CURRENCY_CODE_PATTERN.test(value);
}

export interface MovementRecord {
  type: string;
  amount: number;
}

export function computeAccountBalance(initialBalance: number, movements: readonly MovementRecord[]): number {
  return movements.reduce(
    (balance, movement) => (movement.type === 'INCOME' ? balance + movement.amount : movement.type === 'EXPENSE' ? balance - movement.amount : balance),
    initialBalance,
  );
}
