import type { Metadata } from 'next';
import { toDateKey, today } from '@/domain/dates';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { TransactionList } from '@/components/transactions/TransactionList';
import { PageHeader } from '@/components/ui/PageHeader';
import { listRecentTransactions } from '@/server/services/transaction-service';

export const metadata: Metadata = { title: 'Movimientos' };

export default async function TransactionsPage() {
  const transactions = await listRecentTransactions();

  return (
    <div className="space-y-6">
      <PageHeader title="Movimientos" description="Registra tus entradas y salidas de dinero." />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
        <TransactionForm defaultDate={toDateKey(today())} />
        <section className="space-y-3">
          <h2 className="font-semibold text-slate-900">Últimos movimientos</h2>
          <TransactionList transactions={transactions} />
        </section>
      </div>
    </div>
  );
}
