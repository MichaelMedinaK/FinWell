import { describe, expect, it } from 'vitest';
import { MAX_ONBOARDING_DEBTS, parseMonthlyIncome, parseOnboardingInput } from '../onboarding-input';

const VALID_DEBT = {
  name: 'Tarjeta Visa',
  type: 'CREDIT_CARD',
  totalAmount: '300000',
  remainingInstallments: '3',
  interestRate: '',
  dueDate: '2026-11-05',
};

describe('parseMonthlyIncome', () => {
  it('acepta vacío como ingreso no declarado', () => {
    expect(parseMonthlyIncome('  ')).toEqual({ success: true, data: null });
  });

  it('acepta montos positivos', () => {
    expect(parseMonthlyIncome('1200000')).toEqual({ success: true, data: 1200000 });
  });

  it.each(['0', '-5', 'abc'])('rechaza %s', (text) => {
    expect(parseMonthlyIncome(text).success).toBe(false);
  });
});

describe('parseOnboardingInput', () => {
  it('convierte ingreso y deudas válidas', () => {
    const result = parseOnboardingInput({ monthlyIncome: '900000', debts: JSON.stringify([VALID_DEBT]) });

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.monthlyIncome).toBe(900000);
    expect(result.data.debts).toHaveLength(1);
    expect(result.data.debts[0]).toMatchObject({ name: 'Tarjeta Visa', type: 'CREDIT_CARD', totalAmount: 300000 });
    expect(result.data.debts[0].dueDate.toISOString()).toBe('2026-11-05T00:00:00.000Z');
  });

  it('permite omitir ingreso y deudas', () => {
    expect(parseOnboardingInput({})).toEqual({ success: true, data: { monthlyIncome: null, debts: [] } });
  });

  it('rechaza una deuda inválida', () => {
    const result = parseOnboardingInput({ debts: JSON.stringify([{ ...VALID_DEBT, totalAmount: '0' }]) });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.errors.debts).toBeDefined();
  });

  it('rechaza JSON mal formado o que no es lista', () => {
    expect(parseOnboardingInput({ debts: '{no-json' }).success).toBe(false);
    expect(parseOnboardingInput({ debts: '{"a":1}' }).success).toBe(false);
    expect(parseOnboardingInput({ debts: '[1]' }).success).toBe(false);
  });

  it(`rechaza más de ${MAX_ONBOARDING_DEBTS} deudas`, () => {
    const debts = Array.from({ length: MAX_ONBOARDING_DEBTS + 1 }, () => VALID_DEBT);
    expect(parseOnboardingInput({ debts: JSON.stringify(debts) }).success).toBe(false);
  });

  it('reporta el ingreso inválido', () => {
    const result = parseOnboardingInput({ monthlyIncome: '-1' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.errors.monthlyIncome).toBeDefined();
  });
});
