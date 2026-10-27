import { isIncomeKind, isIncomeOrigin, type IncomeKind, type IncomeOrigin } from '@/domain/income';
import { parseNumber, readText, type FieldErrors, type RawFormValues, type ValidationResult } from './form-values';

const NAME_MAX_LENGTH = 80;
const MAX_MONTHLY_AMOUNT = 1_000_000_000_000;

export interface IncomeSourceInput {
  origin: IncomeOrigin;
  name: string;
  kind: IncomeKind;
  monthlyAmount: number;
}

export function parseIncomeSourceInput(values: RawFormValues): ValidationResult<IncomeSourceInput> {
  const errors: FieldErrors<keyof IncomeSourceInput> = {};

  const origin = readText(values, 'origin') || 'EMPLOYMENT';
  if (!isIncomeOrigin(origin)) errors.origin = 'Selecciona un origen válido.';

  const name = readText(values, 'name');
  if (name === '') errors.name = 'Describe de dónde viene este ingreso.';
  else if (name.length > NAME_MAX_LENGTH) errors.name = `Máximo ${NAME_MAX_LENGTH} caracteres.`;

  const kind = readText(values, 'kind') || 'FIXED';
  if (!isIncomeKind(kind)) errors.kind = 'Selecciona si es fijo o variable.';

  const monthlyAmount = parseNumber(readText(values, 'monthlyAmount'));
  if (monthlyAmount === null || monthlyAmount <= 0 || monthlyAmount > MAX_MONTHLY_AMOUNT) {
    errors.monthlyAmount = 'Ingresa un monto mayor a 0.';
  }

  if (Object.keys(errors).length > 0 || !isIncomeOrigin(origin) || !isIncomeKind(kind) || monthlyAmount === null) {
    return { success: false, errors };
  }

  return { success: true, data: { origin, name, kind, monthlyAmount } };
}
