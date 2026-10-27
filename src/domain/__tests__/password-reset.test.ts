import { describe, expect, it } from 'vitest';
import { computeResetExpiry, isResetTokenExpired, PASSWORD_RESET_TTL_MINUTES } from '../password-reset';

const NOW = new Date('2026-10-27T12:00:00.000Z');

describe('computeResetExpiry', () => {
  it('expires after the configured number of minutes', () => {
    const expiry = computeResetExpiry(NOW);
    expect(expiry.getTime() - NOW.getTime()).toBe(PASSWORD_RESET_TTL_MINUTES * 60_000);
  });
});

describe('isResetTokenExpired', () => {
  it('is valid before the expiry', () => {
    expect(isResetTokenExpired(new Date('2026-10-27T12:00:01.000Z'), NOW)).toBe(false);
  });

  it('is expired exactly at the expiry', () => {
    expect(isResetTokenExpired(NOW, NOW)).toBe(true);
  });

  it('is expired after the expiry', () => {
    expect(isResetTokenExpired(new Date('2026-10-27T11:59:59.000Z'), NOW)).toBe(true);
  });
});
