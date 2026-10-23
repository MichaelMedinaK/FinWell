import { prisma } from '@/lib/prisma';
import { addDays, today } from '@/domain/dates';
import { ALERT_WINDOW_DAYS, selectDebtsNeedingAttention, withDueInfo } from '@/domain/debt';
import type { DebtInput } from '@/lib/validation/debt-input';

export async function listDebtsWithDueInfo(referenceDay: Date = today()) {
  const debts = await prisma.debt.findMany({ orderBy: { dueDate: 'asc' } });
  return withDueInfo(debts, referenceDay);
}

export async function listDebtAlerts(referenceDay: Date = today()) {
  const debts = await prisma.debt.findMany({
    where: { dueDate: { lte: addDays(referenceDay, ALERT_WINDOW_DAYS) } },
    orderBy: { dueDate: 'asc' },
  });
  return selectDebtsNeedingAttention(debts, referenceDay);
}

export function createDebt(input: DebtInput) {
  return prisma.debt.create({ data: input });
}

export function deleteDebt(id: string) {
  return prisma.debt.deleteMany({ where: { id } });
}
