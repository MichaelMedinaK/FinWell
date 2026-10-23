import { describe, expect, it } from 'vitest';
import { parseDebtInput } from '../debt-input';
import { parseTransactionInput } from '../transaction-input';

describe('parseDebtInput', () => {
  const validValues = {
    name: '  Tarjeta Visa ',
    type: 'CREDIT_CARD',
    totalAmount: '450000',
    remainingInstallments: '6',
    interestRate: '',
    dueDate: '2026-10-25',
  };

  it('returns normalized data for valid input', () => {
    const result = parseDebtInput(validValues);
    expect(result).toEqual({
      success: true,
      data: {
        name: 'Tarjeta Visa',
        type: 'CREDIT_CARD',
        totalAmount: 450000,
        remainingInstallments: 6,
        interestRate: null,
        dueDate: new Date('2026-10-25T00:00:00.000Z'),
      },
    });
  });

  it('reports every invalid field', () => {
    const result = parseDebtInput({ name: '', type: 'LOAN', totalAmount: '-5', remainingInstallments: '1.5', interestRate: '150', dueDate: 'x' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(Object.keys(result.errors).sort()).toEqual(
        ['dueDate', 'interestRate', 'name', 'remainingInstallments', 'totalAmount', 'type'].sort(),
      );
    }
  });

  it('accepts an optional interest rate', () => {
    const result = parseDebtInput({ ...validValues, interestRate: '2.5' });
    expect(result.success && result.data.interestRate).toBe(2.5);
  });
});

describe('parseTransactionInput', () => {
  it('returns normalized data and converts empty category to null', () => {
    const result = parseTransactionInput({ type: 'INCOME', amount: '1200.50', description: 'Sueldo', category: '', date: '2026-10-01' });
    expect(result).toEqual({
      success: true,
      data: { type: 'INCOME', amount: 1200.5, description: 'Sueldo', category: null, date: new Date('2026-10-01T00:00:00.000Z') },
    });
  });

  it('rejects missing required fields', () => {
    const result = parseTransactionInput({});
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(Object.keys(result.errors).sort()).toEqual(['amount', 'date', 'description', 'type']);
    }
  });
});
