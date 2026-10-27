import { Wallet } from 'lucide-react';
import { ACCOUNT_KIND_LABELS, type AccountKind } from '@/domain/account';
import { formatCurrency } from '@/lib/format';
import { deleteMoneyAccountAction } from '@/server/actions/transaction-actions';
import { DeleteButton } from '@/components/ui/DeleteButton';
import { AddAccountForm } from './AddAccountForm';

export interface AccountSummary {
  id: string;
  name: string;
  kind: string;
  currency: string;
  balance: number;
}

export function AccountsPanel({ accounts }: { accounts: readonly AccountSummary[] }) {
  return (
    <section className="card space-y-4" aria-labelledby="accounts-title">
      <div className="flex items-center gap-2">
        <Wallet className="h-5 w-5 text-emerald-600" aria-hidden />
        <h2 id="accounts-title" className="font-semibold text-slate-900">
          Mis cuentas
        </h2>
      </div>

      {accounts.length === 0 ? (
        <p className="text-sm text-slate-500">Agrega tu banco, Mercado Pago, efectivo o dólares físicos para saber dónde tienes tu dinero.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {accounts.map((account) => (
            <li key={account.id} className="flex items-center gap-3 py-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900">{account.name}</p>
                <p className="text-xs text-slate-500">{ACCOUNT_KIND_LABELS[account.kind as AccountKind] ?? account.kind}</p>
              </div>
              <p className="whitespace-nowrap text-sm font-semibold text-slate-900">{formatCurrency(account.balance, account.currency)}</p>
              <DeleteButton
                action={deleteMoneyAccountAction.bind(null, account.id)}
                confirmMessage={`¿Eliminar la cuenta "${account.name}"? También se borrarán los movimientos asociados.`}
                label={`Eliminar cuenta ${account.name}`}
              />
            </li>
          ))}
        </ul>
      )}

      <AddAccountForm />
    </section>
  );
}
