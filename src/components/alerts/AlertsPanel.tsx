import { Bell, BellRing, CircleCheck } from 'lucide-react';
import Link from 'next/link';
import { ALERT_WINDOW_DAYS, estimateInstallmentAmount, getDebtTypeLabel, type DebtWithDueInfo } from '@/domain/debt';
import { cn } from '@/lib/cn';
import { formatCurrency, formatDate } from '@/lib/format';
import { DUE_STATUS_STYLES } from '@/components/debts/due-status-presentation';
import { DueStatusBadge } from '@/components/debts/DueStatusBadge';

interface AlertsPanelProps {
  alerts: readonly DebtWithDueInfo[];
  showViewAllLink?: boolean;
}

export function AlertsPanel({ alerts, showViewAllLink = false }: AlertsPanelProps) {
  const hasAlerts = alerts.length > 0;
  const HeaderIcon = hasAlerts ? BellRing : Bell;

  return (
    <section className="card" aria-labelledby="alerts-title">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg', hasAlerts ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500')}>
            <HeaderIcon className="h-4 w-4" aria-hidden />
          </span>
          <h2 id="alerts-title" className="font-semibold text-slate-900">
            Pagos próximos · {ALERT_WINDOW_DAYS} días
          </h2>
        </div>
        {showViewAllLink && hasAlerts && (
          <Link href="/alertas" className="text-sm font-medium text-emerald-700 hover:underline">
            Ver todas
          </Link>
        )}
      </header>

      {hasAlerts ? (
        <ul className="mt-4 space-y-2">
          {alerts.map((debt) => (
            <li
              key={debt.id}
              className={cn('flex flex-wrap items-center justify-between gap-2 rounded-xl border border-l-4 border-slate-100 bg-slate-50/60 p-3', DUE_STATUS_STYLES[debt.status].accent)}
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-900">{debt.name}</p>
                <p className="text-xs text-slate-500">
                  {getDebtTypeLabel(debt.type)} · Cuota aprox. {formatCurrency(estimateInstallmentAmount(debt))} · {formatDate(debt.dueDate)}
                </p>
              </div>
              <DueStatusBadge daysUntilDue={debt.daysUntilDue} status={debt.status} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
          <CircleCheck className="h-4 w-4 shrink-0" aria-hidden />
          No tienes pagos por vencer en los próximos {ALERT_WINDOW_DAYS} días.
        </p>
      )}
    </section>
  );
}
