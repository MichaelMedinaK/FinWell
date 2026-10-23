import type { PeriodFlow } from '@/domain/transaction';
import { formatCurrency, formatMonth, formatWeekday } from '@/lib/format';

const MIN_VISIBLE_BAR_PERCENT = 3;

interface FlowChartProps {
  title: string;
  flows: readonly PeriodFlow[];
  granularity: 'day' | 'month';
}

function toBarHeight(value: number, maxValue: number): string {
  if (value <= 0) return '0%';
  return `${Math.max((value / maxValue) * 100, MIN_VISIBLE_BAR_PERCENT)}%`;
}

export function FlowChart({ title, flows, granularity }: FlowChartProps) {
  const maxValue = Math.max(1, ...flows.flatMap((flow) => [flow.income, flow.expense]));
  const formatLabel = granularity === 'day' ? formatWeekday : formatMonth;

  return (
    <section className="card">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-semibold text-slate-900">{title}</h2>
        <div className="flex gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" aria-hidden /> Entradas
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-rose-400" aria-hidden /> Salidas
          </span>
        </div>
      </div>

      <ul className="mt-5 flex h-44 items-stretch gap-1.5 sm:gap-3">
        {flows.map((flow) => {
          const label = formatLabel(flow.start);
          const summary = `${label}: entradas ${formatCurrency(flow.income)}, salidas ${formatCurrency(flow.expense)}`;
          return (
            <li key={flow.key} className="flex flex-1 flex-col items-center gap-2" aria-label={summary} title={summary}>
              <div className="flex w-full flex-1 items-end justify-center gap-1">
                <div className="w-1/3 max-w-5 rounded-t-md bg-emerald-500" style={{ height: toBarHeight(flow.income, maxValue) }} />
                <div className="w-1/3 max-w-5 rounded-t-md bg-rose-400" style={{ height: toBarHeight(flow.expense, maxValue) }} />
              </div>
              <span className="text-[11px] capitalize text-slate-500">{label}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
