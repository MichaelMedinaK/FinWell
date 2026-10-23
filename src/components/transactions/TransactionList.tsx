import { ArrowDownLeft, ArrowUpRight, Receipt } from 'lucide-react';
import type { Transaction } from '@prisma/client';
import { cn } from '@/lib/cn';
import { formatCurrency, formatDate } from '@/lib/format';
import { deleteTransactionAction } from '@/server/actions/transaction-actions';
import { DeleteButton } from '@/components/ui/DeleteButton';
import { EmptyState } from '@/components/ui/EmptyState';

export function TransactionList({ transactions }: { transactions: readonly Transaction[] }) {
  if (transactions.length === 0) {
    return <EmptyState icon={Receipt} title="Aún no hay movimientos" description="Registra tus entradas y salidas para ver tu resumen financiero." />;
  }

  return (
    <ul className="card divide-y divide-slate-100 p-0 md:p-0">
      {transactions.map((transaction) => {
        const isIncome = transaction.type === 'INCOME';
        const Icon = isIncome ? ArrowDownLeft : ArrowUpRight;
        return (
          <li key={transaction.id} className="flex items-center gap-3 px-4 py-3">
            <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600')}>
              <Icon className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900">{transaction.description}</p>
              <p className="truncate text-xs text-slate-500">
                {[transaction.category, formatDate(transaction.date)].filter(Boolean).join(' · ')}
              </p>
            </div>
            <p className={cn('whitespace-nowrap text-sm font-semibold', isIncome ? 'text-emerald-700' : 'text-rose-700')}>
              {isIncome ? '+' : '−'}
              {formatCurrency(transaction.amount)}
            </p>
            <DeleteButton
              action={deleteTransactionAction.bind(null, transaction.id)}
              confirmMessage={`¿Eliminar "${transaction.description}"?`}
              label={`Eliminar ${transaction.description}`}
            />
          </li>
        );
      })}
    </ul>
  );
}
