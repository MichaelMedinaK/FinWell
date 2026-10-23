import { describe, expect, it } from 'vitest';
import { addDays, parseDateOnly } from '../dates';
import { buildDailyFlows, buildMonthlyFlows, sumFlows, summarizePeriod, type TransactionRecord } from '../transaction';

const referenceDay = parseDateOnly('2026-10-23')!;

const transactions: TransactionRecord[] = [
  { type: 'INCOME', amount: 1000, date: referenceDay },
  { type: 'EXPENSE', amount: 200, date: referenceDay },
  { type: 'EXPENSE', amount: 50, date: addDays(referenceDay, -1) },
  { type: 'INCOME', amount: 500, date: parseDateOnly('2026-09-10')! },
];

describe('sumFlows', () => {
  it('sums income and expense and computes the net', () => {
    expect(sumFlows(transactions)).toEqual({ income: 1500, expense: 250, net: 1250 });
  });

  it('ignores unknown transaction types', () => {
    expect(sumFlows([{ type: 'OTHER', amount: 10, date: referenceDay }])).toEqual({ income: 0, expense: 0, net: 0 });
  });
});

describe('summarizePeriod', () => {
  it('separates today totals from the current month totals', () => {
    const summary = summarizePeriod(transactions, referenceDay);
    expect(summary.today).toEqual({ income: 1000, expense: 200, net: 800 });
    expect(summary.month).toEqual({ income: 1000, expense: 250, net: 750 });
  });
});

describe('flow series', () => {
  it('builds one entry per day ending on the reference day, filling gaps with zeros', () => {
    const daily = buildDailyFlows(transactions, referenceDay, 3);
    expect(daily.map((flow) => flow.key)).toEqual(['2026-10-21', '2026-10-22', '2026-10-23']);
    expect(daily.map((flow) => flow.expense)).toEqual([0, 50, 200]);
  });

  it('builds one entry per month ending on the reference month', () => {
    const monthly = buildMonthlyFlows(transactions, referenceDay, 2);
    expect(monthly.map((flow) => flow.key)).toEqual(['2026-09', '2026-10']);
    expect(monthly.map((flow) => flow.income)).toEqual([500, 1000]);
  });
});
