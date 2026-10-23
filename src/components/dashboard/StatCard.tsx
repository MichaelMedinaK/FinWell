import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatCurrency } from '@/lib/format';

type FlowTone = 'income' | 'expense';

const TONE_STYLES: Record<FlowTone, { icon: typeof ArrowDownLeft; iconClassName: string; amountClassName: string }> = {
  income: { icon: ArrowDownLeft, iconClassName: 'bg-emerald-50 text-emerald-600', amountClassName: 'text-emerald-700' },
  expense: { icon: ArrowUpRight, iconClassName: 'bg-rose-50 text-rose-600', amountClassName: 'text-rose-700' },
};

interface StatCardProps {
  label: string;
  amount: number;
  tone: FlowTone;
}

export function StatCard({ label, amount, tone }: StatCardProps) {
  const { icon: Icon, iconClassName, amountClassName } = TONE_STYLES[tone];

  return (
    <div className="card">
      <div className="flex items-center gap-2">
        <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg', iconClassName)}>
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <p className="text-xs font-medium text-slate-500 md:text-sm">{label}</p>
      </div>
      <p className={cn('mt-3 truncate text-lg font-bold md:text-xl', amountClassName)}>{formatCurrency(amount)}</p>
    </div>
  );
}
