import { describe, expect, it } from 'vitest';
import { estimateMonthlyMargin, monthlyPayoffTarget } from '../debt-payoff';
import { sumFixedExpenses } from '../fixed-expense';
import { sumMonthlyIncome, totalMonthlyIncomeOrNull } from '../income';

describe('income', () => {
  const sources = [
    { kind: 'FIXED' as const, monthlyAmount: 900000 },
    { kind: 'VARIABLE' as const, monthlyAmount: 250000 },
  ];

  it('suma por tipo y en total', () => {
    expect(sumMonthlyIncome(sources, 'FIXED')).toBe(900000);
    expect(sumMonthlyIncome(sources, 'VARIABLE')).toBe(250000);
    expect(sumMonthlyIncome(sources)).toBe(1150000);
  });

  it('devuelve null si no hay fuentes', () => {
    expect(totalMonthlyIncomeOrNull([])).toBeNull();
    expect(totalMonthlyIncomeOrNull(sources)).toBe(1150000);
  });
});

describe('debt payoff', () => {
  it('calcula la cuota mensual objetivo', () => {
    expect(monthlyPayoffTarget(1200000, 12)).toBe(100000);
  });

  it('calcula el margen mensual estimado', () => {
    expect(estimateMonthlyMargin(1000000, sumFixedExpenses([{ monthlyAmount: 400000 }]), 100000)).toBe(500000);
    expect(estimateMonthlyMargin(null, 400000, 100000)).toBeNull();
  });
});
