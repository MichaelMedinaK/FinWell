import { fullYearsBetween, parseDateOnly, today } from '@/domain/dates';
import { readText, type FieldErrors, type RawFormValues, type ValidationResult } from './form-values';

const NAME_MAX_LENGTH = 80;
const EMAIL_MAX_LENGTH = 254;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_MIN_LENGTH = 8;
// bcrypt solo considera los primeros 72 bytes; se limita para que la clave completa sea significativa.
const PASSWORD_MAX_LENGTH = 72;
export const MIN_USER_AGE = 13;
const MAX_USER_AGE = 120;

export interface RegistrationInput {
  email: string;
  name: string;
  password: string;
  birthDate: Date;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ProfileInput {
  birthDate: Date;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function validateEmail(email: string): string | undefined {
  if (email === '') return 'Ingresa tu correo.';
  if (email.length > EMAIL_MAX_LENGTH || !EMAIL_PATTERN.test(email)) return 'Ingresa un correo válido.';
  return undefined;
}

function validateBirthDate(birthDate: Date | null, referenceDay: Date): string | undefined {
  if (birthDate === null) return 'Selecciona una fecha válida.';
  if (birthDate > referenceDay) return 'La fecha no puede ser futura.';
  const age = fullYearsBetween(birthDate, referenceDay);
  if (age < MIN_USER_AGE) return `Debes tener al menos ${MIN_USER_AGE} años.`;
  if (age > MAX_USER_AGE) return 'Revisa el año de nacimiento.';
  return undefined;
}

export function parseRegistrationInput(
  values: RawFormValues,
  referenceDay: Date = today(),
): ValidationResult<RegistrationInput> {
  const errors: FieldErrors<keyof RegistrationInput> = {};

  const email = normalizeEmail(readText(values, 'email'));
  errors.email = validateEmail(email);

  const name = readText(values, 'name');
  if (name === '') errors.name = 'Ingresa tu nombre.';
  else if (name.length > NAME_MAX_LENGTH) errors.name = `Máximo ${NAME_MAX_LENGTH} caracteres.`;

  // La clave no se recorta: los espacios pueden ser parte intencional de ella.
  const password = typeof values.password === 'string' ? values.password : '';
  if (password.length < PASSWORD_MIN_LENGTH) errors.password = `Mínimo ${PASSWORD_MIN_LENGTH} caracteres.`;
  else if (password.length > PASSWORD_MAX_LENGTH) errors.password = `Máximo ${PASSWORD_MAX_LENGTH} caracteres.`;

  const birthDate = parseDateOnly(readText(values, 'birthDate'));
  errors.birthDate = validateBirthDate(birthDate, referenceDay);

  const definedErrors = withoutEmptyErrors(errors);
  if (Object.keys(definedErrors).length > 0 || birthDate === null) {
    return { success: false, errors: definedErrors };
  }
  return { success: true, data: { email, name, password, birthDate } };
}

export function parseLoginInput(values: RawFormValues): ValidationResult<LoginInput> {
  const errors: FieldErrors<keyof LoginInput> = {};

  const email = normalizeEmail(readText(values, 'email'));
  errors.email = validateEmail(email);

  const password = typeof values.password === 'string' ? values.password : '';
  if (password === '') errors.password = 'Ingresa tu clave.';

  const definedErrors = withoutEmptyErrors(errors);
  if (Object.keys(definedErrors).length > 0) return { success: false, errors: definedErrors };
  return { success: true, data: { email, password } };
}

export function parseProfileInput(values: RawFormValues, referenceDay: Date = today()): ValidationResult<ProfileInput> {
  const birthDate = parseDateOnly(readText(values, 'birthDate'));
  const birthDateError = validateBirthDate(birthDate, referenceDay);
  if (birthDateError || birthDate === null) {
    return { success: false, errors: { birthDate: birthDateError ?? 'Selecciona una fecha válida.' } };
  }
  return { success: true, data: { birthDate } };
}

function withoutEmptyErrors<TField extends string>(errors: FieldErrors<TField>): FieldErrors<TField> {
  return Object.fromEntries(Object.entries(errors).filter(([, message]) => message !== undefined)) as FieldErrors<TField>;
}
