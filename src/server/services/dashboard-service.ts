import { startOfMonthOffset, today } from '@/domain/dates';
import { buildDailyFlows, buildMonthlyFlows, summarizePeriod } from '@/domain/transaction';
import { listDebtAlerts } from './debt-service';
import { getCurrentBalance, listTransactionsSince } from './transaction-service';

const DAILY_CHART_DAYS = 7;
const MONTHLY_CHART_MONTHS = 6;

export async function getDashboardData(referenceDay: Date = today()) {
  const chartWindowStart = startOfMonthOffset(referenceDay, -(MONTHLY_CHART_MONTHS - 1));

  const [balance, transactions, debtAlerts] = await Promise.all([
    getCurrentBalance(),
    listTransactionsSince(chartWindowStart),
    listDebtAlerts(referenceDay),
  ]);

  return {
    balance,
    summary: summarizePeriod(transactions, referenceDay),
    dailyFlows: buildDailyFlows(transactions, referenceDay, DAILY_CHART_DAYS),
    monthlyFlows: buildMonthlyFlows(transactions, referenceDay, MONTHLY_CHART_MONTHS),
    debtAlerts,
  };
}
