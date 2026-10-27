import { parseDebtGoalInput, type DebtGoalInput } from './debt-goal-input';
import { parseFixedExpenses, type FixedExpenseInput } from './fixed-expense-input';
import { readText, type RawFormValues, type ValidationResult } from './form-values';
import { parseIncomeSourceInput, type IncomeSourceInput } from './income-source-input';

export const MAX_ONBOARDING_INCOME_SOURCES = 10;

export type IncomeSourceDraft = Record<string, string>;

export interface OnboardingInput {
  incomeSources: IncomeSourceInput[];
  debtGoal: DebtGoalInput | null;
  fixedExpenses: FixedExpenseInput[];
}

function readJson(serialized: string): unknown | null {
  if (serialized === '') return null;
  try {
    return JSON.parse(serialized);
  } catch (error) {
    if (error instanceof SyntaxError) return undefined;
    throw error;
  }
}

function isRecord(value: unknown): value is Record<string, string> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseIncomeSources(serialized: string): { items: IncomeSourceInput[]; error?: string } {
  const parsed = readJson(serialized);
  if (parsed === null) return { items: [] };
  if (!Array.isArray(parsed) || parsed.length > MAX_ONBOARDING_INCOME_SOURCES) {
    return { items: [], error: `Puedes agregar hasta ${MAX_ONBOARDING_INCOME_SOURCES} fuentes de ingreso.` };
  }

  const items: IncomeSourceInput[] = [];
  for (const draft of parsed) {
    const result = isRecord(draft) ? parseIncomeSourceInput(draft) : null;
    if (!result?.success) {
      return { items: [], error: 'Una de las fuentes de ingreso tiene datos inválidos. Revísala e intenta de nuevo.' };
    }
    items.push(result.data);
  }
  return { items };
}

function parseExpenses(serialized: string): { items: FixedExpenseInput[]; error?: string } {
  const parsed = readJson(serialized);
  if (parsed === null) return { items: [] };

  const result = isRecord(parsed) ? parseFixedExpenses(parsed) : null;
  if (!result?.success) return { items: [], error: 'Alguno de los gastos fijos tiene un monto inválido.' };
  return { items: result.data };
}

export function parseOnboardingInput(values: RawFormValues): ValidationResult<OnboardingInput> {
  const incomes = parseIncomeSources(readText(values, 'incomeSources'));
  const debtGoal = parseDebtGoalInput({
    estimatedTotal: readText(values, 'debtEstimatedTotal'),
    payoffMonths: readText(values, 'debtPayoffMonths'),
  });
  const expenses = parseExpenses(readText(values, 'fixedExpenses'));

  if (incomes.error || !debtGoal.success || expenses.error) {
    return {
      success: false,
      errors: {
        ...(incomes.error ? { incomeSources: incomes.error } : {}),
        ...(debtGoal.success ? {} : { debtGoal: 'La deuda estimada o su plazo son inválidos.' }),
        ...(expenses.error ? { fixedExpenses: expenses.error } : {}),
      },
    };
  }

  return {
    success: true,
    data: { incomeSources: incomes.items, debtGoal: debtGoal.data, fixedExpenses: expenses.items },
  };
}
