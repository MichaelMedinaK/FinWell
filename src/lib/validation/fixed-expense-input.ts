import { FIXED_EXPENSE_CATEGORIES, type FixedExpenseCategory } from '@/domain/fixed-expense';
import { parseNumber, type FieldErrors } from './form-values';

const MAX_MONTHLY_AMOUNT = 1_000_000_000_000;

export interface FixedExpenseInput {
  category: FixedExpenseCategory;
  monthlyAmount: number;
}

export type FixedExpensesResult =
  | { success: true; data: FixedExpenseInput[] }
  | { success: false; errors: FieldErrors<FixedExpenseCategory> };

// Cada categoría es opcional: las vacías se omiten y solo se guardan las que el usuario completó.
export function parseFixedExpenses(amounts: Record<string, string>): FixedExpensesResult {
  const data: FixedExpenseInput[] = [];
  const errors: FieldErrors<FixedExpenseCategory> = {};

  for (const category of FIXED_EXPENSE_CATEGORIES) {
    const text = (amounts[category] ?? '').trim();
    if (text === '') continue;

    const monthlyAmount = parseNumber(text);
    if (monthlyAmount === null || monthlyAmount <= 0 || monthlyAmount > MAX_MONTHLY_AMOUNT) {
      errors[category] = 'Ingresa un monto mayor a 0.';
    } else {
      data.push({ category, monthlyAmount });
    }
  }

  return Object.keys(errors).length > 0 ? { success: false, errors } : { success: true, data };
}
