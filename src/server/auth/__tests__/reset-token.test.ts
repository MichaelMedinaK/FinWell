import { describe, expect, it } from 'vitest';
import { generateResetToken, hashResetToken } from '../reset-token';

describe('reset token', () => {
  it('hashes deterministically so the stored hash can be looked up', () => {
    const { token, tokenHash } = generateResetToken();
    expect(hashResetToken(token)).toBe(tokenHash);
  });

  it('never stores the raw token as its hash', () => {
    const { token, tokenHash } = generateResetToken();
    expect(tokenHash).not.toBe(token);
  });

  it('generates a different token each time', () => {
    expect(generateResetToken().token).not.toBe(generateResetToken().token);
  });
});
