export type RawFormValues = Record<string, unknown>;

export type FieldErrors<TField extends string = string> = Partial<Record<TField, string>>;

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: FieldErrors<Extract<keyof T, string>> };

export function readText(values: RawFormValues, field: string): string {
  const value = values[field];
  return typeof value === 'string' ? value.trim() : '';
}

export function parseNumber(text: string): number | null {
  if (text === '') return null;
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : null;
}
