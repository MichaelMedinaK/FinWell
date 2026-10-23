import { Plus } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { DEBT_TYPE_LABELS, DEBT_TYPES } from '@/domain/debt';
import type { FieldErrors } from '@/lib/validation/form-values';
import { parseDebtInput, type DebtInput } from '@/lib/validation/debt-input';
import type { DebtDraft } from '@/lib/validation/onboarding-input';
import { FormField } from '@/components/ui/FormField';
import { cn } from '@/lib/cn';

export function DebtDraftForm({ onAdd }: { onAdd: (draft: DebtDraft, input: DebtInput) => void }) {
  const [errors, setErrors] = useState<FieldErrors<keyof DebtInput>>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const draft = Object.fromEntries(
      Array.from(new FormData(form).entries(), ([field, value]) => [field, String(value)]),
    );
    const result = parseDebtInput(draft);
    if (!result.success) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    onAdd(draft, result.data);
    form.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/40 p-4" noValidate>
      <FormField label="Nombre" htmlFor="debtName" error={errors.name}>
        <input id="debtName" name="name" type="text" className="form-input" placeholder="Ej: Tarjeta Visa, crédito auto" maxLength={80} aria-invalid={Boolean(errors.name)} />
      </FormField>

      <fieldset>
        <legend className="form-label">Tipo</legend>
        <div className="grid grid-cols-2 gap-2">
          {DEBT_TYPES.map((type, index) => (
            <label key={type} className="cursor-pointer">
              <input type="radio" name="type" value={type} defaultChecked={index === 0} className="peer sr-only" />
              <span
                className={cn(
                  'flex items-center justify-center rounded-xl border border-slate-200 bg-surface px-3 py-2 text-sm font-medium text-slate-600 transition',
                  'peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:text-emerald-700 peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-500',
                )}
              >
                {DEBT_TYPE_LABELS[type]}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Monto total" htmlFor="debtTotalAmount" error={errors.totalAmount}>
          <input id="debtTotalAmount" name="totalAmount" type="number" inputMode="decimal" min="0" step="any" className="form-input" aria-invalid={Boolean(errors.totalAmount)} />
        </FormField>
        <FormField label="Cuotas restantes" htmlFor="debtInstallments" error={errors.remainingInstallments}>
          <input id="debtInstallments" name="remainingInstallments" type="number" inputMode="numeric" min="1" step="1" className="form-input" aria-invalid={Boolean(errors.remainingInstallments)} />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Próximo pago" htmlFor="debtDueDate" error={errors.dueDate}>
          <input id="debtDueDate" name="dueDate" type="date" className="form-input" aria-invalid={Boolean(errors.dueDate)} />
        </FormField>
        <FormField label="Interés %" htmlFor="debtInterestRate" error={errors.interestRate} hint="Opcional">
          <input id="debtInterestRate" name="interestRate" type="number" inputMode="decimal" min="0" max="100" step="0.01" className="form-input" aria-invalid={Boolean(errors.interestRate)} />
        </FormField>
      </div>

      <button type="submit" className="btn-secondary w-full">
        <Plus className="h-4 w-4" aria-hidden />
        Agregar a mi lista
      </button>
    </form>
  );
}
