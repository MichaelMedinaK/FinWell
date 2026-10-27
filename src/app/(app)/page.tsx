import { toDateKey, today } from '@/domain/dates';
import { AccountsPanel } from '@/components/accounts/AccountsPanel';
import { TransactionForm } from '@/components/transactions/TransactionForm';
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
  const { balance, summary, dailyFlows, monthlyFlows, debtAlerts, monthlyInstallments, accounts, debtOptions } = await getDashboardData(user.id);

  return (
    <div className="space-y-6">
      <PageHeader title="Bienestar financiero" description="Tu resumen de entradas, salidas y pagos próximos." />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
        <div className="order-2 space-y-6 lg:order-1">
          <TransactionForm defaultDate={toDateKey(today())} accounts={accounts} debts={debtOptions} />
          <AccountsPanel accounts={accounts} />
        </div>

        <div className="order-1 space-y-6 lg:order-2">
          <div className="grid gap-4 xl:grid-cols-3">
            <BalanceCard balance={balance} monthNet={summary.month.net} />
            <div className="grid grid-cols-2 gap-3 md:gap-4 xl:col-span-2">
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

          <FlowChart title="Últimos 7 días" flows={dailyFlows} granularity="day" />
          <FlowChart title="Últimos 6 meses" flows={monthlyFlows} granularity="month" />
        </div>
      </div>
    </div>
  );
}
