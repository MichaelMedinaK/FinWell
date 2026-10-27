import { isAccountKind, isCurrencyCode, type AccountKind } from '@/domain/account';
import { parseNumber, readText, type FieldErrors, type RawFormValues, type ValidationResult } from './form-values';

const NAME_MAX_LENGTH = 40;

export interface MoneyAccountInput {
  name: string;
  kind: AccountKind;
  currency: string;
  initialBalance: number;
}

export function parseMoneyAccountInput(values: RawFormValues): ValidationResult<MoneyAccountInput> {
  const errors: FieldErrors<keyof MoneyAccountInput> = {};

  const name = readText(values, 'name');
  if (name === '') errors.name = 'Ingresa un nombre para la cuenta.';
  else if (name.length > NAME_MAX_LENGTH) errors.name = `Máximo ${NAME_MAX_LENGTH} caracteres.`;

  const kind = readText(values, 'kind');
  if (!isAccountKind(kind)) errors.kind = 'Selecciona el tipo de cuenta.';

  const currency = readText(values, 'currency').toUpperCase();
  if (!isCurrencyCode(currency)) errors.currency = 'Selecciona la moneda.';

  const balanceText = readText(values, 'initialBalance');
  const initialBalance = balanceText === '' ? 0 : parseNumber(balanceText);
  if (initialBalance === null) errors.initialBalance = 'Ingresa un saldo válido.';

  if (Object.keys(errors).length > 0 || !isAccountKind(kind) || initialBalance === null) {
    return { success: false, errors };
  }

  return { success: true, data: { name, kind, currency, initialBalance } };
}
