'use server';

import { revalidatePath } from 'next/cache';
import type { FormState } from '@/lib/form-state';
import { parseMoneyAccountInput } from '@/lib/validation/money-account-input';
import { parseTransactionInput } from '@/lib/validation/transaction-input';
import { requireUserId } from '@/server/auth/session';
import { isPersistenceError, PERSISTENCE_ERROR_MESSAGE } from '@/server/persistence-errors';
import { createMoneyAccount, deleteMoneyAccount } from '@/server/services/money-account-service';
import { createTransaction, deleteTransaction, InvalidReferenceError } from '@/server/services/transaction-service';

export async function createTransactionAction(_previousState: FormState, formData: FormData): Promise<FormState> {
  const userId = await requireUserId();
  const result = parseTransactionInput(Object.fromEntries(formData));
  if (!result.success) {
    return { status: 'error', message: 'Revisa los campos marcados.', errors: result.errors };
  }

  try {
    await createTransaction(userId, result.data);
  } catch (error) {
    if (error instanceof InvalidReferenceError) return { status: 'error', message: error.message };
    if (isPersistenceError(error)) return { status: 'error', message: PERSISTENCE_ERROR_MESSAGE };
    throw error;
  }

  revalidatePath('/', 'layout');
  return { status: 'success', message: 'Movimiento registrado.' };
}

export async function createMoneyAccountAction(_previousState: FormState, formData: FormData): Promise<FormState> {
  const userId = await requireUserId();
  const result = parseMoneyAccountInput(Object.fromEntries(formData));
  if (!result.success) {
    return { status: 'error', message: 'Revisa los campos marcados.', errors: result.errors };
  }

  try {
    await createMoneyAccount(userId, result.data);
  } catch (error) {
    if (isPersistenceError(error)) return { status: 'error', message: PERSISTENCE_ERROR_MESSAGE };
    throw error;
  }

  revalidatePath('/', 'layout');
  return { status: 'success', message: 'Cuenta agregada.' };
}

export async function deleteMoneyAccountAction(id: string): Promise<void> {
  const userId = await requireUserId();
  await deleteMoneyAccount(userId, id);
  revalidatePath('/', 'layout');
}

export async function deleteTransactionAction(id: string): Promise<void> {
  const userId = await requireUserId();
  await deleteTransaction(userId, id);
  revalidatePath('/', 'layout');
}
