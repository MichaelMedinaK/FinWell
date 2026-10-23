import { parseDebtInput, type DebtInput } from './debt-input';
import { parseNumber, readText, type RawFormValues, type ValidationResult } from './form-values';

export const MAX_ONBOARDING_DEBTS = 10;
const MAX_MONTHLY_INCOME = 1_000_000_000_000;

export type DebtDraft = Record<string, string>;

export interface OnboardingInput {
  monthlyIncome: number | null;
  debts: DebtInput[];
}

export type MonthlyIncomeResult = { success: true; data: number | null } | { success: false; error: string };

// El ingreso es opcional: el usuario puede preferir no declararlo y aun así usar la app.
export function parseMonthlyIncome(text: string): MonthlyIncomeResult {
  const trimmed = text.trim();
  if (trimmed === '') return { success: true, data: null };

  const amount = parseNumber(trimmed);
  if (amount === null || amount <= 0 || amount > MAX_MONTHLY_INCOME) {
    return { success: false, error: 'Ingresa un monto mayor a 0.' };
  }
  return { success: true, data: amount };
}

function readDebtDrafts(serializedDebts: string): unknown[] | null {
  if (serializedDebts === '') return [];
  try {
    const parsed: unknown = JSON.parse(serializedDebts);
    return Array.isArray(parsed) ? parsed : null;
  } catch (error) {
    if (error instanceof SyntaxError) return null;
    throw error;
  }
}

function isDebtDraft(value: unknown): value is DebtDraft {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function parseOnboardingInput(values: RawFormValues): ValidationResult<OnboardingInput> {
  const incomeResult = parseMonthlyIncome(readText(values, 'monthlyIncome'));
  const drafts = readDebtDrafts(readText(values, 'debts'));

  const debts: DebtInput[] = [];
  let debtsError: string | undefined;

  if (drafts === null || drafts.length > MAX_ONBOARDING_DEBTS) {
    debtsError = `Puedes agregar hasta ${MAX_ONBOARDING_DEBTS} deudas.`;
  } else {
    for (const draft of drafts) {
      const debtResult = isDebtDraft(draft) ? parseDebtInput(draft) : null;
      if (!debtResult?.success) {
        debtsError = 'Una de las deudas tiene datos inválidos. Revísala e intenta de nuevo.';
        break;
      }
      debts.push(debtResult.data);
    }
  }

  if (!incomeResult.success || debtsError) {
    return {
      success: false,
      errors: {
        ...(incomeResult.success ? {} : { monthlyIncome: incomeResult.error }),
        ...(debtsError ? { debts: debtsError } : {}),
      },
    };
  }

  return { success: true, data: { monthlyIncome: incomeResult.data, debts } };
}
