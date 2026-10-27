import { AuthError, CredentialsSignin } from '@auth/core/errors';
import { describe, expect, it } from 'vitest';
import { classifySignInError, EmailNotFoundError, GoogleAccountError, WrongPasswordError } from '../sign-in-error';

describe('classifySignInError', () => {
  it('identifies an unknown email', () => {
    expect(classifySignInError(new EmailNotFoundError())).toBe('EMAIL_NOT_FOUND');
  });

  it('identifies a wrong password', () => {
    expect(classifySignInError(new WrongPasswordError())).toBe('WRONG_PASSWORD');
  });

  it('identifies an account created with Google', () => {
    expect(classifySignInError(new GoogleAccountError())).toBe('GOOGLE_ACCOUNT');
  });

  it('treats a generic credentials failure as invalid credentials', () => {
    expect(classifySignInError(new CredentialsSignin())).toBe('INVALID_CREDENTIALS');
  });

  it('treats any other auth error as a service problem', () => {
    expect(classifySignInError(new AuthError('database unreachable'))).toBe('SERVICE_UNAVAILABLE');
  });
});
