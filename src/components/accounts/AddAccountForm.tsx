'use client';

import { Loader2, Plus } from 'lucide-react';
import { useActionState } from 'react';
import { ACCOUNT_KINDS, ACCOUNT_KIND_LABELS } from '@/domain/account';
import { APP_CURRENCY } from '@/lib/config';
import { INITIAL_FORM_STATE } from '@/lib/form-state';
import { createMoneyAccountAction } from '@/server/actions/transaction-actions';
import { FormField } from '@/components/ui/FormField';
import { FormStatusMessage } from '@/components/ui/FormStatusMessage';
import { useResettableFormSubmit } from '@/components/ui/useResettableFormSubmit';

const CURRENCY_OPTIONS = Array.from(new Set([APP_CURRENCY, 'USD', 'EUR']));

export function AddAccountForm() {
  const [state, formAction, isPending] = useActionState(createMoneyAccountAction, INITIAL_FORM_STATE);
  const { formRef, handleSubmit } = useResettableFormSubmit(state, formAction);
  const errors = state.errors ?? {};

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-3 border-t border-slate-100 pt-4" noValidate>
      <p className="text-sm font-medium text-slate-700">Agregar cuenta</p>
      <FormField label="Nombre" htmlFor="account-name" error={errors.name}>
        <input id="account-name" name="name" type="text" maxLength={40} placeholder="Ej: Mercado Pago" className="form-input" aria-invalid={Boolean(errors.name)} />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Tipo" htmlFor="account-kind" error={errors.kind}>
          <select id="account-kind" name="kind" className="form-input" defaultValue="BANK">
            {ACCOUNT_KINDS.map((kind) => (
              <option key={kind} value={kind}>
                {ACCOUNT_KIND_LABELS[kind]}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Moneda" htmlFor="account-currency" error={errors.currency}>
          <select id="account-currency" name="currency" className="form-input" defaultValue={APP_CURRENCY}>
            {CURRENCY_OPTIONS.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </FormField>
      </div>
      <FormField label="Saldo actual" htmlFor="account-balance" error={errors.initialBalance} hint="Lo que tienes hoy en esta cuenta">
        <input id="account-balance" name="initialBalance" type="number" inputMode="decimal" step="any" className="form-input" aria-invalid={Boolean(errors.initialBalance)} />
      </FormField>
      <FormStatusMessage state={state} />
      <button type="submit" className="btn-primary w-full" disabled={isPending}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
        Agregar cuenta
      </button>
    </form>
  );
}
