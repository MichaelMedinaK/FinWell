import { computeAccountBalance } from '@/domain/account';
import { prisma } from '@/lib/prisma';
import type { MoneyAccountInput } from '@/lib/validation/money-account-input';

export async function listAccountsWithBalance(userId: string) {
  const [accounts, movements] = await Promise.all([
    prisma.moneyAccount.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } }),
    prisma.transaction.groupBy({ by: ['accountId', 'type'], where: { userId, accountId: { not: null } }, _sum: { amount: true } }),
  ]);

  return accounts.map((account) => ({
    ...account,
    balance: computeAccountBalance(
      account.initialBalance,
      movements
        .filter((movement) => movement.accountId === account.id)
        .map((movement) => ({ type: movement.type, amount: movement._sum.amount ?? 0 })),
    ),
  }));
}

export function createMoneyAccount(userId: string, input: MoneyAccountInput) {
  return prisma.moneyAccount.create({ data: { ...input, userId } });
}

export function deleteMoneyAccount(userId: string, id: string) {
  return prisma.moneyAccount.deleteMany({ where: { id, userId } });
}
