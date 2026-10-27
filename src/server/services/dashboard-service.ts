import { startOfMonthOffset, today } from '@/domain/dates';
import { sumMonthlyInstallments } from '@/domain/financial-health';
import { buildDailyFlows, buildMonthlyFlows, summarizePeriod } from '@/domain/transaction';
import { listDebtAlerts, listDebtPaymentOptions, listInstallmentSources } from './debt-service';
import { listAccountsWithBalance } from './money-account-service';
import { getCurrentBalance, listTransactionsSince } from './transaction-service';

const DAILY_CHART_DAYS = 7;
const MONTHLY_CHART_MONTHS = 6;

export async function getDashboardData(userId: string, referenceDay: Date = today()) {
  const chartWindowStart = startOfMonthOffset(referenceDay, -(MONTHLY_CHART_MONTHS - 1));

  const [balance, transactions, debtAlerts, installmentSources, accounts, debtOptions] = await Promise.all([
    getCurrentBalance(userId),
    listTransactionsSince(userId, chartWindowStart),
    listDebtAlerts(userId, referenceDay),
    listInstallmentSources(userId),
    listAccountsWithBalance(userId),
    listDebtPaymentOptions(userId),
  ]);

  return {
    balance,
    accounts,
    debtOptions,
    summary: summarizePeriod(transactions, referenceDay),
    dailyFlows: buildDailyFlows(transactions, referenceDay, DAILY_CHART_DAYS),
    monthlyFlows: buildMonthlyFlows(transactions, referenceDay, MONTHLY_CHART_MONTHS),
    debtAlerts,
    monthlyInstallments: sumMonthlyInstallments(installmentSources),
  };
}
