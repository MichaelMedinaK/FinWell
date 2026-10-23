import { prisma } from '@/lib/prisma';
import type { TransactionInput } from '@/lib/validation/transaction-input';

const DEFAULT_LIST_LIMIT = 50;

export function listRecentTransactions(limit: number = DEFAULT_LIST_LIMIT) {
  return prisma.transaction.findMany({ orderBy: [{ date: 'desc' }, { createdAt: 'desc' }], take: limit });
}

export function listTransactionsSince(since: Date) {
  return prisma.transaction.findMany({ where: { date: { gte: since } }, orderBy: { date: 'asc' } });
}

export async function getCurrentBalance(): Promise<number> {
  const totalsByType = await prisma.transaction.groupBy({ by: ['type'], _sum: { amount: true } });
  const totalFor = (type: string) => totalsByType.find((group) => group.type === type)?._sum.amount ?? 0;
  return totalFor('INCOME') - totalFor('EXPENSE');
}

export function createTransaction(input: TransactionInput) {
  return prisma.transaction.create({ data: input });
}

export function deleteTransaction(id: string) {
  return prisma.transaction.deleteMany({ where: { id } });
}
