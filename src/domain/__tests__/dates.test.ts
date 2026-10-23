import { describe, expect, it } from 'vitest';
import { addDays, daysBetween, parseDateOnly, startOfMonthOffset, toDateKey, toMonthKey } from '../dates';

describe('parseDateOnly', () => {
  it('parses a valid YYYY-MM-DD string as UTC midnight', () => {
    expect(parseDateOnly('2026-10-23')?.toISOString()).toBe('2026-10-23T00:00:00.000Z');
  });

  it.each(['', '23-10-2026', '2026-02-30', '2026-13-01', 'abc'])('rejects invalid value "%s"', (value) => {
    expect(parseDateOnly(value)).toBeNull();
  });
});

describe('date arithmetic', () => {
  const reference = parseDateOnly('2026-01-15')!;

  it('adds days and computes differences in whole days', () => {
    expect(toDateKey(addDays(reference, 5))).toBe('2026-01-20');
    expect(daysBetween(reference, addDays(reference, -3))).toBe(-3);
  });

  it('moves to the start of previous months across year boundaries', () => {
    expect(toMonthKey(startOfMonthOffset(reference, -2))).toBe('2025-11');
    expect(toDateKey(startOfMonthOffset(reference, 0))).toBe('2026-01-01');
  });
});
