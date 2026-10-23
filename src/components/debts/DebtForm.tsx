'use client';

import { Loader2, Plus } from 'lucide-react';
import { useActionState } from 'react';
import { DEBT_TYPE_LABELS, DEBT_TYPES } from '@/domain/debt';
import { INITIAL_FORM_STATE } from '@/lib/form-state';
import { createDebtAction } from '@/server/actions/debt-actions';
import { FormField } from '@/components/ui/FormField';
import { FormStatusMessage } from '@/components/ui/FormStatusMessage';
import { useResettableFormSubmit } from '@/components/ui/useResettableFormSubmit';

export function DebtForm() {
  const [state, formAction, isPending] = useActionState(createDebtAction, INITIAL_FORM_STATE);
  const { formRef, handleSubmit } = useResettableFormSubmit(state, formAction);
  const errors = state.errors ?? {};

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="card space-y-4" noValidate>
      <h2 className="font-semibold text-slate-900">Nueva deuda o tarjeta</h2>

      <FormField label="Nombre" htmlFor="name" error={errors.name}>
        <input id="name" name="name" type="text" className="form-input" placeholder="Ej: Tarjeta Visa" maxLength={80} required aria-invalid={Boolean(errors.name)} />
      </FormField>

      <FormField label="Tipo" htmlFor="type" error={errors.type}>
        <select id="type" name="type" className="form-input" defaultValue="DEBT">
          {DEBT_TYPES.map((type) => (
            <option key={type} value={type}>
              {DEBT_TYPE_LABELS[type]}
            </option>
          ))}
        </select>
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Monto total" htmlFor="totalAmount" error={errors.totalAmount}>
          <input id="totalAmount" name="totalAmount" type="number" inputMode="decimal" min="0" step="any" className="form-input" required aria-invalid={Boolean(errors.totalAmount)} />
        </FormField>
        <FormField label="Cuotas restantes" htmlFor="remainingInstallments" error={errors.remainingInstallments}>
          <input id="remainingInstallments" name="remainingInstallments" type="number" inputMode="numeric" min="1" step="1" className="form-input" required aria-invalid={Boolean(errors.remainingInstallments)} />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Tasa de interés %" htmlFor="interestRate" error={errors.interestRate} hint="Opcional">
          <input id="interestRate" name="interestRate" type="number" inputMode="decimal" min="0" max="100" step="0.01" className="form-input" aria-invalid={Boolean(errors.interestRate)} />
        </FormField>
        <FormField label="Fecha límite de pago" htmlFor="dueDate" error={errors.dueDate}>
          <input id="dueDate" name="dueDate" type="date" className="form-input" required aria-invalid={Boolean(errors.dueDate)} />
        </FormField>
      </div>

      <FormStatusMessage state={state} />

      <button type="submit" className="btn-primary w-full" disabled={isPending}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
        Agregar
      </button>
    </form>
  );
}
