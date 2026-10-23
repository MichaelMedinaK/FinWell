import { parseDateOnly } from '@/domain/dates';
import { isDebtType, type DebtType } from '@/domain/debt';
import { parseNumber, readText, type FieldErrors, type RawFormValues, type ValidationResult } from './form-values';

const NAME_MAX_LENGTH = 80;
const MAX_INTEREST_RATE = 100;

export interface DebtInput {
  name: string;
  type: DebtType;
  totalAmount: number;
  remainingInstallments: number;
  interestRate: number | null;
  dueDate: Date;
}

export function parseDebtInput(values: RawFormValues): ValidationResult<DebtInput> {
  const errors: FieldErrors<keyof DebtInput> = {};

  const name = readText(values, 'name');
  if (name === '') errors.name = 'Ingresa un nombre.';
  else if (name.length > NAME_MAX_LENGTH) errors.name = `Máximo ${NAME_MAX_LENGTH} caracteres.`;

  const type = readText(values, 'type') || 'DEBT';
  if (!isDebtType(type)) errors.type = 'Selecciona un tipo válido.';

  const totalAmount = parseNumber(readText(values, 'totalAmount'));
  if (totalAmount === null || totalAmount <= 0) errors.totalAmount = 'Ingresa un monto mayor a 0.';

  const remainingInstallments = parseNumber(readText(values, 'remainingInstallments'));
  if (remainingInstallments === null || !Number.isInteger(remainingInstallments) || remainingInstallments < 1) {
    errors.remainingInstallments = 'Ingresa un número entero de cuotas (mínimo 1).';
  }

  const interestRateText = readText(values, 'interestRate');
  const interestRate = parseNumber(interestRateText);
  if (interestRateText !== '' && (interestRate === null || interestRate < 0 || interestRate > MAX_INTEREST_RATE)) {
    errors.interestRate = `La tasa debe estar entre 0 y ${MAX_INTEREST_RATE}.`;
  }

  const dueDate = parseDateOnly(readText(values, 'dueDate'));
  if (dueDate === null) errors.dueDate = 'Selecciona una fecha válida.';

  if (
    Object.keys(errors).length > 0 ||
    !isDebtType(type) ||
    totalAmount === null ||
    remainingInstallments === null ||
    dueDate === null
  ) {
    return { success: false, errors };
  }

  return { success: true, data: { name, type, totalAmount, remainingInstallments, interestRate, dueDate } };
}
