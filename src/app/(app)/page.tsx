import { AlertsPanel } from '@/components/alerts/AlertsPanel';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { DebtLoadIndicator } from '@/components/dashboard/DebtLoadIndicator';
import { FlowChart } from '@/components/dashboard/FlowChart';
import { StatCard } from '@/components/dashboard/StatCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { requireCompleteUser } from '@/server/auth/session';
import { getDashboardData } from '@/server/services/dashboard-service';

export default async function DashboardPage() {
  const user = await requireCompleteUser();
  const { balance, summary, dailyFlows, monthlyFlows, debtAlerts, monthlyInstallments } = await getDashboardData(user.id);

  return (
    <div className="space-y-6">
      <PageHeader title="Bienestar financiero" description="Tu resumen de entradas, salidas y pagos próximos." />

      <div className="grid gap-4 lg:grid-cols-3">
        <BalanceCard balance={balance} monthNet={summary.month.net} />
        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:col-span-2">
          <StatCard label="Entradas hoy" amount={summary.today.income} tone="income" />
          <StatCard label="Salidas hoy" amount={summary.today.expense} tone="expense" />
          <StatCard label="Entradas del mes" amount={summary.month.income} tone="income" />
          <StatCard label="Salidas del mes" amount={summary.month.expense} tone="expense" />
        </div>
      </div>

      <AlertsPanel alerts={debtAlerts} showViewAllLink />

      {user.monthlyIncome !== null && (
        <DebtLoadIndicator monthlyIncome={user.monthlyIncome} monthlyInstallments={monthlyInstallments} />
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <FlowChart title="Últimos 7 días" flows={dailyFlows} granularity="day" />
        <FlowChart title="Últimos 6 meses" flows={monthlyFlows} granularity="month" />
      </div>
    </div>
  );
}
