'use server';

import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn, signOut } from '@/auth';
import type { FormState } from '@/lib/form-state';
import { parseLoginInput, parseProfileInput, parseRegistrationInput } from '@/lib/validation/user-input';
import { hashPassword } from '@/server/auth/password';
import { LOGIN_PATH, requireUserId } from '@/server/auth/session';
import { classifySignInError, type SignInFailure } from '@/server/auth/sign-in-error';
import { isPersistenceError, isUniqueConstraintError, PERSISTENCE_ERROR_MESSAGE } from '@/server/persistence-errors';
import { createPasswordUser, findUserByEmail, updateBirthDate } from '@/server/services/user-service';

const HOME_PATH = '/';
const INVALID_CREDENTIALS_MESSAGE = 'Correo o clave incorrectos.';
const SIGN_IN_FAILURE_STATES: Partial<Record<SignInFailure, FormState>> = {
  EMAIL_NOT_FOUND: { status: 'error', errors: { email: 'No existe una cuenta con este correo. Regístrate primero.' } },
  WRONG_PASSWORD: { status: 'error', errors: { password: 'La clave es incorrecta. Revísala o recupérala.' } },
  GOOGLE_ACCOUNT: {
    status: 'error',
    errors: { email: 'Esta cuenta se creó con Google. Usa "Continuar con Google" o recupera una clave.' },
  },
};
const SERVICE_UNAVAILABLE_MESSAGE = 'No pudimos conectar con el servidor. Intenta nuevamente en unos minutos.';
const EMAIL_TAKEN_ERROR = 'Este correo ya está registrado. Inicia sesión.';

/*
 * signIn() comunica el éxito lanzando la redirección de Next.js, por eso solo se capturan
 * errores de Auth.js y todo lo demás se relanza.
 */
async function signInWithPassword(email: string, password: string): Promise<FormState> {
  try {
    await signIn('credentials', { email, password, redirectTo: HOME_PATH });
  } catch (error) {
    if (error instanceof AuthError) {
      const failure = classifySignInError(error);
      const failureState = SIGN_IN_FAILURE_STATES[failure];
      if (failureState) return failureState;
      if (failure === 'INVALID_CREDENTIALS') {
        return { status: 'error', message: INVALID_CREDENTIALS_MESSAGE };
      }
      console.error('[FinWell] Falla interna al iniciar sesión:', error.cause ?? error);
      return { status: 'error', message: SERVICE_UNAVAILABLE_MESSAGE };
    }
    throw error;
  }
  return { status: 'success' };
}

export async function loginAction(_previousState: FormState, formData: FormData): Promise<FormState> {
  const result = parseLoginInput(Object.fromEntries(formData));
  if (!result.success) return { status: 'error', message: 'Revisa los campos marcados.', errors: result.errors };
  return signInWithPassword(result.data.email, result.data.password);
}

export async function registerAction(_previousState: FormState, formData: FormData): Promise<FormState> {
  const result = parseRegistrationInput(Object.fromEntries(formData));
  if (!result.success) return { status: 'error', message: 'Revisa los campos marcados.', errors: result.errors };

  const { email, name, password, birthDate } = result.data;
  const emailTakenState: FormState = { status: 'error', errors: { email: EMAIL_TAKEN_ERROR } };

  try {
    if (await findUserByEmail(email)) return emailTakenState;
    await createPasswordUser({ email, name, birthDate, passwordHash: await hashPassword(password) });
  } catch (error) {
    // Dos registros simultáneos con el mismo correo pasan la verificación previa; la BD lo resuelve.
    if (isUniqueConstraintError(error)) return emailTakenState;
    if (isPersistenceError(error)) return { status: 'error', message: PERSISTENCE_ERROR_MESSAGE };
    throw error;
  }

  return signInWithPassword(email, password);
}

export async function googleSignInAction(): Promise<void> {
  await signIn('google', { redirectTo: HOME_PATH });
}

export async function completeProfileAction(_previousState: FormState, formData: FormData): Promise<FormState> {
  const userId = await requireUserId();
  const result = parseProfileInput(Object.fromEntries(formData));
  if (!result.success) return { status: 'error', message: 'Revisa los campos marcados.', errors: result.errors };

  try {
    await updateBirthDate(userId, result.data.birthDate);
  } catch (error) {
    if (isPersistenceError(error)) return { status: 'error', message: PERSISTENCE_ERROR_MESSAGE };
    throw error;
  }

  revalidatePath('/', 'layout');
  redirect(HOME_PATH);
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: LOGIN_PATH });
}
