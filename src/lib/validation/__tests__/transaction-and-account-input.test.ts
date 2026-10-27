import { describe, expect, it } from 'vitest';
import { parseMoneyAccountInput } from '../money-account-input';
import { parseTransactionInput } from '../transaction-input';

const validExpense = { type: 'EXPENSE', subtype: 'DAILY', amount: '1500', description: 'Café', date: '2026-03-10' };

describe('parseTransactionInput', () => {
  it('acepta un gasto diario válido', () => {
    const result = parseTransactionInput(validExpense);
    expect(result.success).toBe(true);
  });

  it('rechaza un subtipo que no corresponde al tipo', () => {
    const result = parseTransactionInput({ ...validExpense, type: 'INCOME', subtype: 'DAILY' });
    expect(result.success).toBe(false);
  });

  it('exige la deuda en un pago de deuda y permite descripción vacía', () => {
    const base = { ...validExpense, subtype: 'DEBT_PAYMENT', description: '' };
    const missing = parseTransactionInput(base);
    expect(missing.success).toBe(false);
    if (!missing.success) expect(missing.errors.debtId).toBeDefined();

    const ok = parseTransactionInput({ ...base, debtId: 'debt-1' });
    expect(ok.success).toBe(true);
    if (ok.success) expect(ok.data.debtId).toBe('debt-1');
  });

  it('exige descripción en gastos que no son pago de deuda', () => {
    const result = parseTransactionInput({ ...validExpense, description: '' });
    expect(result.success).toBe(false);
  });
});

describe('parseMoneyAccountInput', () => {
  it('normaliza moneda y saldo vacío', () => {
    const result = parseMoneyAccountInput({ name: 'Mercado Pago', kind: 'WALLET', currency: 'usd', initialBalance: '' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.currency).toBe('USD');
      expect(result.data.initialBalance).toBe(0);
    }
  });

  it('rechaza nombre vacío y tipo inválido', () => {
    const result = parseMoneyAccountInput({ name: '', kind: 'NOPE', currency: 'CLP' });
    expect(result.success).toBe(false);
  });
});
