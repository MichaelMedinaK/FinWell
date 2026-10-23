import { Gauge } from 'lucide-react';
import { calculateDebtLoadPercent, classifyDebtLoad, type DebtLoadLevel } from '@/domain/financial-health';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/cn';

const LEVEL_PRESENTATION: Record<DebtLoadLevel, { label: string; message: string; barClass: string; textClass: string }> = {
  healthy: {
    label: 'Saludable',
    message: 'Tus cuotas están en un nivel sano. ¡Sigue así!',
    barClass: 'bg-emerald-500',
    textClass: 'text-emerald-700',
  },
  moderate: {
    label: 'Moderada',
    message: 'Vas bien, pero evita sumar nuevas deudas por ahora.',
    barClass: 'bg-amber-500',
    textClass: 'text-amber-700',
  },
  high: {
    label: 'Alta',
    message: 'Tus cuotas pesan bastante. Prioriza pagar las de mayor interés.',
    barClass: 'bg-rose-500',
    textClass: 'text-rose-700',
  },
};

interface DebtLoadIndicatorProps {
  monthlyIncome: number;
  monthlyInstallments: number;
  className?: string;
}

export function DebtLoadIndicator({ monthlyIncome, monthlyInstallments, className }: DebtLoadIndicatorProps) {
  const debtLoadPercent = calculateDebtLoadPercent(monthlyInstallments, monthlyIncome) ?? 0;
  const presentation = LEVEL_PRESENTATION[classifyDebtLoad(debtLoadPercent)];

  return (
    <section className={cn('card space-y-3', className)} aria-label="Carga de deudas">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-700">
          <Gauge className="h-5 w-5" aria-hidden />
          <h2 className="font-semibold">Carga de deudas</h2>
        </div>
        <span className={cn('text-sm font-semibold', presentation.textClass)}>
          {presentation.label} · {Math.round(debtLoadPercent)}%
        </span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={cn('h-full rounded-full transition-all', presentation.barClass)}
          style={{ width: `${Math.min(debtLoadPercent, 100)}%` }}
        />
      </div>

      <p className="text-sm text-slate-500">
        Cuotas aprox. <strong className="text-slate-800">{formatCurrency(monthlyInstallments)}</strong> de un ingreso de{' '}
        <strong className="text-slate-800">{formatCurrency(monthlyIncome)}</strong> al mes.
      </p>
      <p className={cn('text-sm font-medium', presentation.textClass)}>{presentation.message}</p>
    </section>
  );
}
