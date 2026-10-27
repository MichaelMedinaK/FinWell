import { describe, expect, it } from 'vitest';
import { computeAccountBalance, isAccountKind, isCurrencyCode } from '../account';
import { addMonths, parseDateOnly } from '../dates';
import { applyInstallmentPayment } from '../debt';
import { isSubtypeOf } from '../transaction';

const date = (value: string) => parseDateOnly(value)!;

describe('computeAccountBalance', () => {
  it('suma entradas y resta salidas al saldo inicial', () => {
    const movements = [
      { type: 'INCOME', amount: 100 },
      { type: 'EXPENSE', amount: 30 },
    ];
    expect(computeAccountBalance(50, movements)).toBe(120);
  });

  it('devuelve el saldo inicial sin movimientos', () => {
    expect(computeAccountBalance(75, [])).toBe(75);
  });
});

describe('validadores de cuenta', () => {
  it('reconoce tipos y monedas válidos', () => {
    expect(isAccountKind('WALLET')).toBe(true);
    expect(isAccountKind('X')).toBe(false);
    expect(isCurrencyCode('USD')).toBe(true);
    expect(isCurrencyCode('usd')).toBe(false);
  });
});

describe('isSubtypeOf', () => {
  it('acepta subtipos de su tipo y rechaza los ajenos', () => {
    expect(isSubtypeOf('EXPENSE', 'DEBT_PAYMENT')).toBe(true);
    expect(isSubtypeOf('INCOME', 'DEBT_PAYMENT')).toBe(false);
    expect(isSubtypeOf('INCOME', 'VARIABLE')).toBe(true);
  });
});

describe('addMonths', () => {
  it('ajusta al último día del mes cuando el destino es más corto', () => {
    expect(addMonths(date('2026-01-31'), 1).toISOString().slice(0, 10)).toBe('2026-02-28');
  });

  it('cruza el cambio de año', () => {
    expect(addMonths(date('2026-12-15'), 1).toISOString().slice(0, 10)).toBe('2027-01-15');
  });
});

describe('applyInstallmentPayment', () => {
  it('baja el saldo, descuenta una cuota y adelanta el vencimiento', () => {
    const result = applyInstallmentPayment({ totalAmount: 300, remainingInstallments: 3, dueDate: date('2026-03-10') }, 100);
    expect(result.totalAmount).toBe(200);
    expect(result.remainingInstallments).toBe(2);
    expect(result.dueDate.toISOString().slice(0, 10)).toBe('2026-04-10');
  });

  it('no deja valores negativos en la última cuota y mantiene la fecha', () => {
    const result = applyInstallmentPayment({ totalAmount: 90, remainingInstallments: 1, dueDate: date('2026-03-10') }, 120);
    expect(result.totalAmount).toBe(0);
    expect(result.remainingInstallments).toBe(0);
    expect(result.dueDate.toISOString().slice(0, 10)).toBe('2026-03-10');
  });
});
