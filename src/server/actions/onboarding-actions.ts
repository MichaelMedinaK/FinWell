'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { FormState } from '@/lib/form-state';
import { parseOnboardingInput } from '@/lib/validation/onboarding-input';
import { requireUserId } from '@/server/auth/session';
import { isPersistenceError, PERSISTENCE_ERROR_MESSAGE } from '@/server/persistence-errors';
import { completeOnboarding, skipOnboarding } from '@/server/services/onboarding-service';

const HOME_PATH = '/';

export async function completeOnboardingAction(_previousState: FormState, formData: FormData): Promise<FormState> {
  const userId = await requireUserId();
  const result = parseOnboardingInput(Object.fromEntries(formData));
  if (!result.success) return { status: 'error', message: 'Revisa los datos ingresados.', errors: result.errors };

  try {
    await completeOnboarding(userId, result.data);
  } catch (error) {
    if (isPersistenceError(error)) return { status: 'error', message: PERSISTENCE_ERROR_MESSAGE };
    throw error;
  }

  revalidatePath('/', 'layout');
  redirect(HOME_PATH);
}

export async function skipOnboardingAction(): Promise<void> {
  const userId = await requireUserId();
  await skipOnboarding(userId);
  revalidatePath('/', 'layout');
  redirect(HOME_PATH);
}
