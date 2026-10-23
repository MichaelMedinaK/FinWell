import { Wallet } from 'lucide-react';
import { formatCurrency } from '@/lib/format';

export function BalanceCard({ balance, monthNet }: { balance: number; monthNet: number }) {
  const isMonthPositive = monthNet >= 0;

  return (
    <section className="rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-5 text-white shadow-lg shadow-emerald-900/10 md:p-6">
      <div className="flex items-center gap-2 text-emerald-100">
        <Wallet className="h-5 w-5" aria-hidden />
        <h2 className="text-sm font-medium">Balance actual</h2>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{formatCurrency(balance)}</p>
      <p className="mt-4 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
        Neto del mes: {isMonthPositive ? '+' : ''}
        {formatCurrency(monthNet)}
      </p>
    </section>
  );
}
