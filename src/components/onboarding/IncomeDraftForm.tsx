import { Plus } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import {
  INCOME_KIND_HINTS,
  INCOME_KIND_LABELS,
  INCOME_KINDS,
  INCOME_ORIGIN_LABELS,
  INCOME_ORIGINS,
  type IncomeKind,
} from '@/domain/income';
import { cn } from '@/lib/cn';
import { parseIncomeSourceInput, type IncomeSourceInput } from '@/lib/validation/income-source-input';
import type { FieldErrors } from '@/lib/validation/form-values';
import type { IncomeSourceDraft } from '@/lib/validation/onboarding-input';
import { FormField } from '@/components/ui/FormField';

interface IncomeDraftFormProps {
  onAdd: (draft: IncomeSourceDraft, input: IncomeSourceInput) => void;
}

export function IncomeDraftForm({ onAdd }: IncomeDraftFormProps) {
  const [errors, setErrors] = useState<FieldErrors<keyof IncomeSourceInput>>({});
  const [kind, setKind] = useState<IncomeKind>('FIXED');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const draft = Object.fromEntries(
      Array.from(new FormData(form).entries(), ([field, value]) => [field, String(value)]),
    );
    const result = parseIncomeSourceInput(draft);
    if (!result.success) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    onAdd(draft, result.data);
    form.reset();
    setKind('FIXED');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/40 p-4" noValidate>
      <fieldset>
        <legend className="form-label">Tipo de ingreso</legend>
        <div className="grid grid-cols-2 gap-2">
          {INCOME_KINDS.map((option) => (
            <label key={option} className="cursor-pointer">
              <input
                type="radio"
                name="kind"
                value={option}
                checked={kind === option}
                onChange={() => setKind(option)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  'flex items-center justify-center rounded-xl border border-slate-200 bg-surface px-3 py-2 text-sm font-medium text-slate-600 transition',
                  'peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:text-emerald-700 peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-500',
                )}
              >
                {INCOME_KIND_LABELS[option]}
              </span>
            </label>
          ))}
        </div>
        <p className="mt-1.5 text-xs text-slate-500">{INCOME_KIND_HINTS[kind]}</p>
      </fieldset>

      <FormField label="Origen" htmlFor="incomeOrigin" error={errors.origin}>
        <select id="incomeOrigin" name="origin" className="form-input" defaultValue={INCOME_ORIGINS[0]}>
          {INCOME_ORIGINS.map((origin) => (
            <option key={origin} value={origin}>
              {INCOME_ORIGIN_LABELS[origin]}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Detalle" htmlFor="incomeName" error={errors.name}>
        <input
          id="incomeName"
          name="name"
          type="text"
          className="form-input"
          placeholder="Ej: Sueldo en mi empresa, ventas por redes, pololos"
          maxLength={80}
          aria-invalid={Boolean(errors.name)}
        />
      </FormField>

      <FormField
        label={kind === 'VARIABLE' ? 'Promedio mensual' : 'Monto mensual'}
        htmlFor="incomeAmount"
        error={errors.monthlyAmount}
      >
        <input
          id="incomeAmount"
          name="monthlyAmount"
          type="number"
          inputMode="decimal"
          min="0"
          step="any"
          className="form-input"
          aria-invalid={Boolean(errors.monthlyAmount)}
        />
      </FormField>

      <button type="submit" className="btn-secondary w-full">
        <Plus className="h-4 w-4" aria-hidden />
        Agregar ingreso
      </button>
    </form>
  );
}
