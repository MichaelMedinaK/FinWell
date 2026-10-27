import { parseDateOnly } from '@/domain/dates';
import { DEBT_PAYMENT_SUBTYPE, isSubtypeOf, isTransactionType, type TransactionType } from '@/domain/transaction';
import { parseNumber, readText, type FieldErrors, type RawFormValues, type ValidationResult } from './form-values';

const DESCRIPTION_MAX_LENGTH = 120;
const CATEGORY_MAX_LENGTH = 40;

export interface TransactionInput {
  type: TransactionType;
  subtype: string;
  amount: number;
  description: string;
  category: string | null;
  date: Date;
  accountId: string | null;
  debtId: string | null;
}

export function parseTransactionInput(values: RawFormValues): ValidationResult<TransactionInput> {
  const errors: FieldErrors<keyof TransactionInput> = {};

  const type = readText(values, 'type');
  if (!isTransactionType(type)) errors.type = 'Selecciona entrada o salida.';

  const subtype = readText(values, 'subtype');
  if (isTransactionType(type) && !isSubtypeOf(type, subtype)) errors.subtype = 'Selecciona el tipo de movimiento.';

  const isDebtPayment = type === 'EXPENSE' && subtype === DEBT_PAYMENT_SUBTYPE;
  const debtId = isDebtPayment ? readText(values, 'debtId') : '';
  if (isDebtPayment && debtId === '') errors.debtId = 'Selecciona la deuda que estás pagando.';

  const amount = parseNumber(readText(values, 'amount'));
  if (amount === null || amount <= 0) errors.amount = 'Ingresa un monto mayor a 0.';

  // En un pago de deuda la descripción se completa con el nombre de la deuda.
  const description = readText(values, 'description');
  if (description === '' && !isDebtPayment) errors.description = 'Ingresa una descripción.';
  else if (description.length > DESCRIPTION_MAX_LENGTH) errors.description = `Máximo ${DESCRIPTION_MAX_LENGTH} caracteres.`;

  const category = readText(values, 'category');
  if (category.length > CATEGORY_MAX_LENGTH) errors.category = `Máximo ${CATEGORY_MAX_LENGTH} caracteres.`;

  const date = parseDateOnly(readText(values, 'date'));
  if (date === null) errors.date = 'Selecciona una fecha válida.';

  if (Object.keys(errors).length > 0 || !isTransactionType(type) || amount === null || date === null) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      type,
      subtype,
      amount,
      description,
      category: category || null,
      date,
      accountId: readText(values, 'accountId') || null,
      debtId: debtId || null,
    },
  };
}
