import { prisma } from '@/lib/prisma';
import { addDays, today } from '@/domain/dates';
import { ALERT_WINDOW_DAYS, selectDebtsNeedingAttention, withDueInfo } from '@/domain/debt';
import type { DebtInput } from '@/lib/validation/debt-input';

export async function listDebtsWithDueInfo(userId: string, referenceDay: Date = today()) {
  const debts = await prisma.debt.findMany({ where: { userId }, orderBy: { dueDate: 'asc' } });
  return withDueInfo(debts, referenceDay);
}

export async function listDebtAlerts(userId: string, referenceDay: Date = today()) {
  const debts = await prisma.debt.findMany({
    where: { userId, dueDate: { lte: addDays(referenceDay, ALERT_WINDOW_DAYS) } },
    orderBy: { dueDate: 'asc' },
  });
  return selectDebtsNeedingAttention(debts, referenceDay);
}

export function listInstallmentSources(userId: string) {
  return prisma.debt.findMany({ where: { userId }, select: { totalAmount: true, remainingInstallments: true } });
}

export function createDebt(userId: string, input: DebtInput) {
  return prisma.debt.create({ data: { ...input, userId } });
}

export function deleteDebt(userId: string, id: string) {
  return prisma.debt.deleteMany({ where: { id, userId } });
}
