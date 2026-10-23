import type { Metadata } from 'next';
import { CreditCard } from 'lucide-react';
import { sumOutstandingDebt } from '@/domain/debt';
import { formatCurrency } from '@/lib/format';
import { DebtCard } from '@/components/debts/DebtCard';
import { DebtForm } from '@/components/debts/DebtForm';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { listDebtsWithDueInfo } from '@/server/services/debt-service';

export const metadata: Metadata = { title: 'Deudas y tarjetas' };

export default async function DebtsPage() {
  const debts = await listDebtsWithDueInfo();
  const creditCardCount = debts.filter((debt) => debt.type === 'CREDIT_CARD').length;

  return (
    <div className="space-y-6">
      <PageHeader title="Deudas y tarjetas" description="Controla tus compromisos y fechas límite de pago." />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <div className="card col-span-2 md:col-span-1">
          <p className="text-xs text-slate-500">Deuda total</p>
          <p className="mt-1 truncate text-xl font-bold text-slate-900 md:text-xl">{formatCurrency(sumOutstandingDebt(debts))}</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-500">Deudas</p>
          <p className="mt-1 text-base font-bold text-slate-900 md:text-xl">{debts.length - creditCardCount}</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-500">Tarjetas</p>
          <p className="mt-1 text-base font-bold text-slate-900 md:text-xl">{creditCardCount}</p>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
        <DebtForm />
        <section className="space-y-3">
          <h2 className="font-semibold text-slate-900">Ordenadas por fecha límite</h2>
          {debts.length === 0 ? (
            <EmptyState icon={CreditCard} title="Sin deudas registradas" description="Agrega tus deudas y tarjetas para recibir avisos antes de su vencimiento." />
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {debts.map((debt) => (
                <DebtCard key={debt.id} debt={debt} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
