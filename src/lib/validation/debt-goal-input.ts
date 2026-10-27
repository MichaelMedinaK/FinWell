import { parseNumber, readText, type FieldErrors, type RawFormValues } from './form-values';

const MAX_ESTIMATED_TOTAL = 1_000_000_000_000;
const MAX_PAYOFF_MONTHS = 600;

export interface DebtGoalInput {
  estimatedTotal: number;
  payoffMonths: number;
}

export type DebtGoalResult =
  | { success: true; data: DebtGoalInput | null }
  | { success: false; errors: FieldErrors<keyof DebtGoalInput> };

// Las deudas son opcionales: sin monto estimado no hay meta y el plazo se ignora.
export function parseDebtGoalInput(values: RawFormValues): DebtGoalResult {
  const totalText = readText(values, 'estimatedTotal');
  if (totalText === '') return { success: true, data: null };

  const errors: FieldErrors<keyof DebtGoalInput> = {};

  const estimatedTotal = parseNumber(totalText);
  if (estimatedTotal === null || estimatedTotal <= 0 || estimatedTotal > MAX_ESTIMATED_TOTAL) {
    errors.estimatedTotal = 'Ingresa un monto mayor a 0.';
  }

  const payoffMonths = parseNumber(readText(values, 'payoffMonths'));
  if (payoffMonths === null || !Number.isInteger(payoffMonths) || payoffMonths < 1 || payoffMonths > MAX_PAYOFF_MONTHS) {
    errors.payoffMonths = `Ingresa los meses (entre 1 y ${MAX_PAYOFF_MONTHS}).`;
  }

  if (Object.keys(errors).length > 0 || estimatedTotal === null || payoffMonths === null) {
    return { success: false, errors };
  }
  return { success: true, data: { estimatedTotal, payoffMonths } };
}
