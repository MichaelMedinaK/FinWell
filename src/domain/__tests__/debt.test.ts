import { describe, expect, it } from 'vitest';
import { addDays, parseDateOnly } from '../dates';
import {
  classifyDueStatus,
  estimateInstallmentAmount,
  selectDebtsNeedingAttention,
  sumOutstandingDebt,
  type DebtRecord,
} from '../debt';

const referenceDay = parseDateOnly('2026-10-23')!;

function buildDebt(id: string, daysFromReference: number): DebtRecord {
  return {
    id,
    name: `Deuda ${id}`,
    type: 'DEBT',
    totalAmount: 1000,
    remainingInstallments: 4,
    interestRate: null,
    dueDate: addDays(referenceDay, daysFromReference),
  };
}

describe('classifyDueStatus', () => {
  it.each([
    [-1, 'overdue'],
    [0, 'urgent'],
    [2, 'urgent'],
    [3, 'soon'],
    [5, 'soon'],
    [6, 'ok'],
  ] as const)('classifies %i days as %s', (days, expected) => {
    expect(classifyDueStatus(days)).toBe(expected);
  });
});

describe('selectDebtsNeedingAttention', () => {
  it('returns overdue debts and debts due within 5 days, sorted by urgency', () => {
    const debts = [buildDebt('later', 6), buildDebt('soon', 5), buildDebt('today', 0), buildDebt('late', -2)];

    const result = selectDebtsNeedingAttention(debts, referenceDay);

    expect(result.map((debt) => debt.id)).toEqual(['late', 'today', 'soon']);
    expect(result.map((debt) => debt.status)).toEqual(['overdue', 'urgent', 'soon']);
  });

  it('returns an empty list when nothing is due', () => {
    expect(selectDebtsNeedingAttention([buildDebt('far', 30)], referenceDay)).toEqual([]);
  });
});

describe('debt amounts', () => {
  it('estimates the installment by dividing the total by remaining installments', () => {
    expect(estimateInstallmentAmount({ totalAmount: 1000, remainingInstallments: 4 })).toBe(250);
    expect(estimateInstallmentAmount({ totalAmount: 1000, remainingInstallments: 0 })).toBe(1000);
  });

  it('sums the outstanding debt', () => {
    expect(sumOutstandingDebt([{ totalAmount: 100 }, { totalAmount: 250.5 }])).toBe(350.5);
  });
});
