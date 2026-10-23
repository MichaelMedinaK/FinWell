import { describe, expect, it } from 'vitest';
import { calculateDebtLoadPercent, classifyDebtLoad, sumMonthlyInstallments } from '../financial-health';

describe('sumMonthlyInstallments', () => {
  it('suma la cuota estimada de cada deuda', () => {
    const debts = [
      { totalAmount: 300000, remainingInstallments: 3 },
      { totalAmount: 50000, remainingInstallments: 1 },
    ];
    expect(sumMonthlyInstallments(debts)).toBe(150000);
  });

  it('devuelve 0 sin deudas', () => {
    expect(sumMonthlyInstallments([])).toBe(0);
  });
});

describe('calculateDebtLoadPercent', () => {
  it('calcula el porcentaje del ingreso destinado a cuotas', () => {
    expect(calculateDebtLoadPercent(250000, 1000000)).toBe(25);
  });

  it('devuelve null si no hay ingreso declarado o es 0', () => {
    expect(calculateDebtLoadPercent(100000, null)).toBeNull();
    expect(calculateDebtLoadPercent(100000, 0)).toBeNull();
  });
});

describe('classifyDebtLoad', () => {
  it.each([
    [0, 'healthy'],
    [29.9, 'healthy'],
    [30, 'moderate'],
    [49.9, 'moderate'],
    [50, 'high'],
    [120, 'high'],
  ] as const)('%s%% es %s', (percent, expected) => {
    expect(classifyDebtLoad(percent)).toBe(expected);
  });
});
