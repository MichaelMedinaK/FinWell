'use server';

import { revalidatePath } from 'next/cache';
import type { FormState } from '@/lib/form-state';
import { parseDebtInput } from '@/lib/validation/debt-input';
import { requireUserId } from '@/server/auth/session';
import { isPersistenceError, PERSISTENCE_ERROR_MESSAGE } from '@/server/persistence-errors';
import { createDebt, deleteDebt } from '@/server/services/debt-service';

export async function createDebtAction(_previousState: FormState, formData: FormData): Promise<FormState> {
  const userId = await requireUserId();
  const result = parseDebtInput(Object.fromEntries(formData));
  if (!result.success) {
    return { status: 'error', message: 'Revisa los campos marcados.', errors: result.errors };
  }

  try {
    await createDebt(userId, result.data);
  } catch (error) {
    if (isPersistenceError(error)) return { status: 'error', message: PERSISTENCE_ERROR_MESSAGE };
    throw error;
  }

  // Las alertas aparecen en el layout (badge) y en varias páginas, por eso se revalida todo el árbol.
  revalidatePath('/', 'layout');
  return { status: 'success', message: 'Registro guardado correctamente.' };
}

export async function deleteDebtAction(id: string): Promise<void> {
  const userId = await requireUserId();
  await deleteDebt(userId, id);
  revalidatePath('/', 'layout');
}
