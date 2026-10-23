import { prisma } from '@/lib/prisma';
import type { TransactionInput } from '@/lib/validation/transaction-input';

const DEFAULT_LIST_LIMIT = 50;

export function listRecentTransactions(userId: string, limit: number = DEFAULT_LIST_LIMIT) {
  return prisma.transaction.findMany({
    where: { userId },
    orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    take: limit,
  });
}

export function listTransactionsSince(userId: string, since: Date) {
  return prisma.transaction.findMany({ where: { userId, date: { gte: since } }, orderBy: { date: 'asc' } });
}

export async function getCurrentBalance(userId: string): Promise<number> {
  const totalsByType = await prisma.transaction.groupBy({
    by: ['type'],
    where: { userId },
    _sum: { amount: true },
  });
  const totalFor = (type: string) => totalsByType.find((group) => group.type === type)?._sum.amount ?? 0;
  return totalFor('INCOME') - totalFor('EXPENSE');
}

export function createTransaction(userId: string, input: TransactionInput) {
  return prisma.transaction.create({ data: { ...input, userId } });
}

export function deleteTransaction(userId: string, id: string) {
  return prisma.transaction.deleteMany({ where: { id, userId } });
}
