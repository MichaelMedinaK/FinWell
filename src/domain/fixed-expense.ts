export const FIXED_EXPENSE_CATEGORIES = ['HOUSING', 'ELECTRICITY', 'WATER', 'GAS', 'INTERNET_PHONE', 'TRANSPORT', 'FOOD', 'OTHER'] as const;
export type FixedExpenseCategory = (typeof FIXED_EXPENSE_CATEGORIES)[number];

export const FIXED_EXPENSE_LABELS: Record<FixedExpenseCategory, string> = {
  HOUSING: 'Arriendo / dividendo',
  ELECTRICITY: 'Luz',
  WATER: 'Agua',
  GAS: 'Gas',
  INTERNET_PHONE: 'Internet y teléfono',
  TRANSPORT: 'Transporte',
  FOOD: 'Alimentación',
  OTHER: 'Otros gastos fijos',
};

export function isFixedExpenseCategory(value: string): value is FixedExpenseCategory {
  return (FIXED_EXPENSE_CATEGORIES as readonly string[]).includes(value);
}

export function sumFixedExpenses(expenses: readonly { monthlyAmount: number }[]): number {
  return expenses.reduce((total, expense) => total + expense.monthlyAmount, 0);
}
