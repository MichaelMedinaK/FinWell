import { AuthError, CredentialsSignin } from '@auth/core/errors';

export type SignInFailure = 'EMAIL_NOT_FOUND' | 'WRONG_PASSWORD' | 'GOOGLE_ACCOUNT' | 'INVALID_CREDENTIALS' | 'SERVICE_UNAVAILABLE';

export class EmailNotFoundError extends CredentialsSignin {
  code = 'EMAIL_NOT_FOUND';
}

export class WrongPasswordError extends CredentialsSignin {
  code = 'WRONG_PASSWORD';
}

// La cuenta se creó con Google y nunca definió una clave.
export class GoogleAccountError extends CredentialsSignin {
  code = 'GOOGLE_ACCOUNT';
}

// authorize() lanza errores específicos; cualquier otro AuthError proviene de una falla interna
// (base de datos caída, variable de entorno ausente...).
export function classifySignInError(error: AuthError): SignInFailure {
  if (error instanceof EmailNotFoundError) return 'EMAIL_NOT_FOUND';
  if (error instanceof WrongPasswordError) return 'WRONG_PASSWORD';
  if (error instanceof GoogleAccountError) return 'GOOGLE_ACCOUNT';
  return error instanceof CredentialsSignin ? 'INVALID_CREDENTIALS' : 'SERVICE_UNAVAILABLE';
}
