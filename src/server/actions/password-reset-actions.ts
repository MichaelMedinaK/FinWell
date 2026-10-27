'use server';

import { redirect } from 'next/navigation';
import type { FormState } from '@/lib/form-state';
import { parseForgotPasswordInput, parseResetPasswordInput } from '@/lib/validation/user-input';
import { hashPassword } from '@/server/auth/password';
import { getAppBaseUrl, sendPasswordResetEmail } from '@/server/email/password-reset-mailer';
import { isPersistenceError, PERSISTENCE_ERROR_MESSAGE } from '@/server/persistence-errors';
import { createPasswordResetToken, resetPasswordWithToken } from '@/server/services/password-reset-service';
import { findUserByEmail } from '@/server/services/user-service';

// Misma respuesta exista o no el correo, para no revelar qué cuentas están registradas.
const RESET_REQUESTED_MESSAGE = 'Si el correo está registrado, te enviamos un enlace para crear una clave nueva.';
const EXPIRED_LINK_MESSAGE = 'El enlace venció o ya fue usado. Solicita uno nuevo.';
const VALIDATION_MESSAGE = 'Revisa los campos marcados.';

export async function requestPasswordResetAction(_previousState: FormState, formData: FormData): Promise<FormState> {
  const result = parseForgotPasswordInput(Object.fromEntries(formData));
  if (!result.success) return { status: 'error', message: VALIDATION_MESSAGE, errors: result.errors };

  try {
    const user = await findUserByEmail(result.data.email);
    if (user) {
      const token = await createPasswordResetToken(user.id);
      const resetUrl = `${getAppBaseUrl()}/restablecer-clave?token=${encodeURIComponent(token)}`;
      try {
        await sendPasswordResetEmail({ to: user.email, name: user.name, resetUrl });
      } catch (mailError) {
        // Se registra pero no se muestra: un error de envío distinto según el correo delataría si existe.
        console.error('[FinWell] No se pudo enviar el correo de restablecimiento:', mailError);
      }
    }
  } catch (error) {
    if (isPersistenceError(error)) return { status: 'error', message: PERSISTENCE_ERROR_MESSAGE };
    throw error;
  }

  return { status: 'success', message: RESET_REQUESTED_MESSAGE };
}

export async function resetPasswordAction(_previousState: FormState, formData: FormData): Promise<FormState> {
  const result = parseResetPasswordInput(Object.fromEntries(formData));
  if (!result.success) return { status: 'error', message: VALIDATION_MESSAGE, errors: result.errors };

  let wasReset: boolean;
  try {
    wasReset = await resetPasswordWithToken(result.data.token, await hashPassword(result.data.password));
  } catch (error) {
    if (isPersistenceError(error)) return { status: 'error', message: PERSISTENCE_ERROR_MESSAGE };
    throw error;
  }

  if (!wasReset) return { status: 'error', message: EXPIRED_LINK_MESSAGE };
  redirect('/login?reset=ok');
}
