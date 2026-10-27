import { AuthError, CredentialsSignin } from '@auth/core/errors';
import { describe, expect, it } from 'vitest';
import { classifySignInError } from '../sign-in-error';

describe('classifySignInError', () => {
  it('treats a credentials mismatch as invalid credentials', () => {
    expect(classifySignInError(new CredentialsSignin())).toBe('INVALID_CREDENTIALS');
  });

  it('treats any other auth error as a service problem', () => {
    expect(classifySignInError(new AuthError('database unreachable'))).toBe('SERVICE_UNAVAILABLE');
  });
});
