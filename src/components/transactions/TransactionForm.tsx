'use client';

import { Loader2, Plus } from 'lucide-react';
import { useActionState } from 'react';
import { TRANSACTION_TYPE_LABELS, TRANSACTION_TYPES } from '@/domain/transaction';
import { INITIAL_FORM_STATE } from '@/lib/form-state';
import { createTransactionAction } from '@/server/actions/transaction-actions';
import { FormField } from '@/components/ui/FormField';
import { FormStatusMessage } from '@/components/ui/FormStatusMessage';
import { useResettableFormSubmit } from '@/components/ui/useResettableFormSubmit';

export function TransactionForm({ defaultDate }: { defaultDate: string }) {
  const [state, formAction, isPending] = useActionState(createTransactionAction, INITIAL_FORM_STATE);
  const { formRef, handleSubmit } = useResettableFormSubmit(state, formAction);
  const errors = state.errors ?? {};

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="card space-y-4" noValidate>
      <h2 className="font-semibold text-slate-900">Nuevo movimiento</h2>

      <fieldset>
        <legend className="form-label">Tipo</legend>
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
          {TRANSACTION_TYPES.map((type) => (
            <label key={type} className="cursor-pointer">
              <input type="radio" name="type" value={type} defaultChecked={type === 'EXPENSE'} className="peer sr-only" />
              <span className="block rounded-lg py-2 text-center text-sm font-medium text-slate-600 transition peer-checked:bg-white peer-checked:text-slate-900 peer-checked:shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-500">
                {TRANSACTION_TYPE_LABELS[type]}
              </span>
            </label>
          ))}
        </div>
        {errors.type && <p className="form-error">{errors.type}</p>}
      </fieldset>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Monto" htmlFor="amount" error={errors.amount}>
          <input id="amount" name="amount" type="number" inputMode="decimal" min="0" step="any" className="form-input" required aria-invalid={Boolean(errors.amount)} />
        </FormField>
        <FormField label="Fecha" htmlFor="date" error={errors.date}>
          <input id="date" name="date" type="date" defaultValue={defaultDate} className="form-input" required aria-invalid={Boolean(errors.date)} />
        </FormField>
      </div>

      <FormField label="Descripción" htmlFor="description" error={errors.description}>
        <input id="description" name="description" type="text" maxLength={120} placeholder="Ej: Supermercado" className="form-input" required aria-invalid={Boolean(errors.description)} />
      </FormField>

      <FormField label="Categoría" htmlFor="category" error={errors.category} hint="Opcional">
        <input id="category" name="category" type="text" maxLength={40} placeholder="Ej: Alimentación" className="form-input" />
      </FormField>

      <FormStatusMessage state={state} />

      <button type="submit" className="btn-primary w-full" disabled={isPending}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
        Registrar
      </button>
    </form>
  );
}
