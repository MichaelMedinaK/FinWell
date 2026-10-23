'use server';

import { revalidatePath } from 'next/cache';
import type { FormState } from '@/lib/form-state';
import { parseTransactionInput } from '@/lib/validation/transaction-input';
import { isPersistenceError, PERSISTENCE_ERROR_MESSAGE } from '@/server/persistence-errors';
import { createTransaction, deleteTransaction } from '@/server/services/transaction-service';

export async function createTransactionAction(_previousState: FormState, formData: FormData): Promise<FormState> {
  const result = parseTransactionInput(Object.fromEntries(formData));
  if (!result.success) {
    return { status: 'error', message: 'Revisa los campos marcados.', errors: result.errors };
  }

  try {
    await createTransaction(result.data);
  } catch (error) {
    if (isPersistenceError(error)) return { status: 'error', message: PERSISTENCE_ERROR_MESSAGE };
    throw error;
  }

  revalidatePath('/', 'layout');
  return { status: 'success', message: 'Movimiento registrado.' };
}

export async function deleteTransactionAction(id: string): Promise<void> {
  await deleteTransaction(id);
  revalidatePath('/', 'layout');
}
