import { CredentialsSignin, type AuthError } from '@auth/core/errors';

export type SignInFailure = 'INVALID_CREDENTIALS' | 'SERVICE_UNAVAILABLE';

// authorize() devuelve null cuando los datos no coinciden (CredentialsSignin); cualquier otro
// AuthError proviene de una falla interna (base de datos caída, variable de entorno ausente...).
export function classifySignInError(error: AuthError): SignInFailure {
  return error instanceof CredentialsSignin ? 'INVALID_CREDENTIALS' : 'SERVICE_UNAVAILABLE';
}
