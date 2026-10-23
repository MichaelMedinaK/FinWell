import { CreditCard, Landmark } from 'lucide-react';
import { estimateInstallmentAmount, getDebtTypeLabel, type DebtWithDueInfo } from '@/domain/debt';
import { cn } from '@/lib/cn';
import { formatCurrency, formatDate, formatPercent } from '@/lib/format';
import { deleteDebtAction } from '@/server/actions/debt-actions';
import { DeleteButton } from '@/components/ui/DeleteButton';
import { DUE_STATUS_STYLES } from './due-status-presentation';
import { DueStatusBadge } from './DueStatusBadge';

export function DebtCard({ debt }: { debt: DebtWithDueInfo }) {
  const TypeIcon = debt.type === 'CREDIT_CARD' ? CreditCard : Landmark;

  return (
    <article className={cn('card border-l-4', DUE_STATUS_STYLES[debt.status].accent)}>
      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <TypeIcon className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-slate-900">{debt.name}</h3>
            <p className="text-xs text-slate-500">{getDebtTypeLabel(debt.type)}</p>
          </div>
        </div>
        <DeleteButton
          action={deleteDebtAction.bind(null, debt.id)}
          confirmMessage={`¿Eliminar "${debt.name}"? Esta acción no se puede deshacer.`}
          label={`Eliminar ${debt.name}`}
        />
      </header>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <div>
          <dt className="text-xs text-slate-500">Monto total</dt>
          <dd className="font-semibold text-slate-900">{formatCurrency(debt.totalAmount)}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Cuotas restantes</dt>
          <dd className="font-semibold text-slate-900">{debt.remainingInstallments}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Cuota aprox.</dt>
          <dd className="font-medium text-slate-700">{formatCurrency(estimateInstallmentAmount(debt))}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Tasa de interés</dt>
          <dd className="font-medium text-slate-700">{debt.interestRate === null ? '—' : formatPercent(debt.interestRate)}</dd>
        </div>
      </dl>

      <footer className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <p className="text-xs text-slate-500">
          Fecha límite: <span className="font-medium text-slate-700">{formatDate(debt.dueDate)}</span>
        </p>
        <DueStatusBadge daysUntilDue={debt.daysUntilDue} status={debt.status} />
      </footer>
    </article>
  );
}
