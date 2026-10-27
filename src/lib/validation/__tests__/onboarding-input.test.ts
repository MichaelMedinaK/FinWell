import { describe, expect, it } from 'vitest';
import { MAX_ONBOARDING_INCOME_SOURCES, parseOnboardingInput } from '../onboarding-input';

const VALID_INCOME = { origin: 'EMPLOYMENT', name: 'Sueldo', kind: 'FIXED', monthlyAmount: '900000' };
const VARIABLE_INCOME = { origin: 'FREELANCE', name: 'Pololos', kind: 'VARIABLE', monthlyAmount: '250000' };

describe('parseOnboardingInput', () => {
  it('convierte ingresos, meta de deuda y gastos fijos', () => {
    const result = parseOnboardingInput({
      incomeSources: JSON.stringify([VALID_INCOME, VARIABLE_INCOME]),
      debtEstimatedTotal: '1200000',
      debtPayoffMonths: '12',
      fixedExpenses: JSON.stringify({ ELECTRICITY: '30000', WATER: '', HOUSING: '350000' }),
    });

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.incomeSources).toHaveLength(2);
    expect(result.data.incomeSources[1]).toMatchObject({ kind: 'VARIABLE', monthlyAmount: 250000 });
    expect(result.data.debtGoal).toEqual({ estimatedTotal: 1200000, payoffMonths: 12 });
    expect(result.data.fixedExpenses).toEqual([
      { category: 'HOUSING', monthlyAmount: 350000 },
      { category: 'ELECTRICITY', monthlyAmount: 30000 },
    ]);
  });

  it('permite omitir todo', () => {
    expect(parseOnboardingInput({})).toEqual({
      success: true,
      data: { incomeSources: [], debtGoal: null, fixedExpenses: [] },
    });
  });

  it('rechaza una fuente de ingreso inválida', () => {
    const result = parseOnboardingInput({ incomeSources: JSON.stringify([{ ...VALID_INCOME, monthlyAmount: '0' }]) });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.errors.incomeSources).toBeDefined();
  });

  it('rechaza JSON mal formado o que no es lista', () => {
    expect(parseOnboardingInput({ incomeSources: '{no-json' }).success).toBe(false);
    expect(parseOnboardingInput({ incomeSources: '{"a":1}' }).success).toBe(false);
    expect(parseOnboardingInput({ incomeSources: '[1]' }).success).toBe(false);
  });

  it(`rechaza más de ${MAX_ONBOARDING_INCOME_SOURCES} fuentes`, () => {
    const sources = Array.from({ length: MAX_ONBOARDING_INCOME_SOURCES + 1 }, () => VALID_INCOME);
    expect(parseOnboardingInput({ incomeSources: JSON.stringify(sources) }).success).toBe(false);
  });

  it('exige plazo cuando hay deuda estimada', () => {
    const result = parseOnboardingInput({ debtEstimatedTotal: '500000' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.errors.debtGoal).toBeDefined();
  });

  it('rechaza gastos fijos inválidos', () => {
    expect(parseOnboardingInput({ fixedExpenses: JSON.stringify({ WATER: '-3' }) }).success).toBe(false);
    expect(parseOnboardingInput({ fixedExpenses: '[1]' }).success).toBe(false);
  });
});
