'use client';

import { Loader2, Plus } from 'lucide-react';
import { useActionState, useEffect, useState } from 'react';
import { DEBT_PAYMENT_SUBTYPE, TRANSACTION_SUBTYPE_LABELS, TRANSACTION_SUBTYPES, TRANSACTION_TYPE_LABELS, TRANSACTION_TYPES, type TransactionType } from '@/domain/transaction';
import { INITIAL_FORM_STATE } from '@/lib/form-state';
import { formatCurrency } from '@/lib/format';
import { createTransactionAction } from '@/server/actions/transaction-actions';
import { FormField } from '@/components/ui/FormField';
import { FormStatusMessage } from '@/components/ui/FormStatusMessage';
import { useResettableFormSubmit } from '@/components/ui/useResettableFormSubmit';

export interface AccountOption {
  id: string;
  name: string;
  currency: string;
}

export interface DebtOption {
  id: string;
  name: string;
  installmentAmount: number;
}

interface TransactionFormProps {
  defaultDate: string;
  accounts: readonly AccountOption[];
  debts: readonly DebtOption[];
}

export function TransactionForm({ defaultDate, accounts, debts }: TransactionFormProps) {
  const [state, formAction, isPending] = useActionState(createTransactionAction, INITIAL_FORM_STATE);
  const { formRef, handleSubmit } = useResettableFormSubmit(state, formAction);
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [subtype, setSubtype] = useState<string>(TRANSACTION_SUBTYPES.EXPENSE[0]);
  const [debtId, setDebtId] = useState('');
  const [formVersion, setFormVersion] = useState(0);
  const errors = state.errors ?? {};

  // Remontar el formulario tras guardar evita que el reset del DOM desincronice los campos controlados.
  useEffect(() => {
    if (state.status !== 'success') return;
    setType('EXPENSE');
    setSubtype(TRANSACTION_SUBTYPES.EXPENSE[0]);
    setDebtId('');
    setFormVersion((version) => version + 1);
  }, [state]);

  const isDebtPayment = type === 'EXPENSE' && subtype === DEBT_PAYMENT_SUBTYPE;
  const selectedDebt = debts.find((debt) => debt.id === debtId);

  function changeType(nextType: TransactionType) {
    setType(nextType);
    setSubtype(TRANSACTION_SUBTYPES[nextType][0]);
    setDebtId('');
  }

  return (
    <form key={formVersion} ref={formRef} onSubmit={handleSubmit} className="card space-y-4" noValidate>
      <h2 className="font-semibold text-slate-900">Registrar movimiento</h2>

      <fieldset>
        <legend className="form-label">Tipo</legend>
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
          {TRANSACTION_TYPES.map((option) => (
            <label key={option} className="cursor-pointer">
              <input type="radio" name="type" value={option} checked={type === option} onChange={() => changeType(option)} className="peer sr-only" />
              <span className="block rounded-lg py-2 text-center text-sm font-medium text-slate-600 transition peer-checked:bg-surface peer-checked:text-slate-900 peer-checked:shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-500">
                {TRANSACTION_TYPE_LABELS[option]}
              </span>
            </label>
          ))}
        </div>
        {errors.type && <p className="form-error">{errors.type}</p>}
      </fieldset>

      <FormField label={type === 'EXPENSE' ? '¿Qué tipo de gasto es?' : '¿Qué tipo de ingreso es?'} htmlFor="subtype" error={errors.subtype}>
        <select id="subtype" name="subtype" className="form-input" value={subtype} onChange={(event) => setSubtype(event.target.value)}>
          {TRANSACTION_SUBTYPES[type].map((option) => (
            <option key={option} value={option}>
              {TRANSACTION_SUBTYPE_LABELS[type][option]}
            </option>
          ))}
        </select>
      </FormField>

      {isDebtPayment && (
        <FormField
          label="Deuda o tarjeta que pagas"
          htmlFor="debtId"
          error={errors.debtId}
          hint={debts.length === 0 ? 'Aún no tienes deudas agendadas: agrégalas en la sección Deudas.' : selectedDebt ? `Cuota aproximada: ${formatCurrency(selectedDebt.installmentAmount)}` : undefined}
        >
          <select id="debtId" name="debtId" className="form-input" value={debtId} onChange={(event) => setDebtId(event.target.value)} aria-invalid={Boolean(errors.debtId)}>
            <option value="">Selecciona…</option>
            {debts.map((debt) => (
              <option key={debt.id} value={debt.id}>
                {debt.name}
              </option>
            ))}
          </select>
        </FormField>
      )}

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Monto" htmlFor="amount" error={errors.amount}>
          <input id="amount" name="amount" type="number" inputMode="decimal" min="0" step="any" className="form-input" required aria-invalid={Boolean(errors.amount)} />
        </FormField>
        <FormField label="Fecha" htmlFor="date" error={errors.date}>
          <input id="date" name="date" type="date" defaultValue={defaultDate} className="form-input" required aria-invalid={Boolean(errors.date)} />
        </FormField>
      </div>

      <FormField label={type === 'EXPENSE' ? '¿Desde qué cuenta?' : '¿A qué cuenta entra?'} htmlFor="accountId" error={errors.accountId} hint={accounts.length === 0 ? 'Opcional. Crea tus cuentas en el panel “Mis cuentas”.' : 'Opcional'}>
        <select id="accountId" name="accountId" className="form-input" defaultValue="">
          <option value="">Sin cuenta</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name} ({account.currency})
            </option>
          ))}
        </select>
      </FormField>

      <FormField label={isDebtPayment ? 'Nota' : 'Descripción'} htmlFor="description" error={errors.description} hint={isDebtPayment ? 'Opcional' : undefined}>
        <input id="description" name="description" type="text" maxLength={120} placeholder={isDebtPayment ? 'Ej: Cuota de mayo' : 'Ej: Supermercado'} className="form-input" aria-invalid={Boolean(errors.description)} />
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
