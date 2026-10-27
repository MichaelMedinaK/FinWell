import { Prisma } from '@prisma/client';
import { applyInstallmentPayment } from '@/domain/debt';
import { DEBT_PAYMENT_SUBTYPE } from '@/domain/transaction';
import { APP_CURRENCY } from '@/lib/config';
import { prisma } from '@/lib/prisma';
import type { TransactionInput } from '@/lib/validation/transaction-input';

const DEFAULT_LIST_LIMIT = 50;

export class InvalidReferenceError extends Error {}

// Los movimientos en otra moneda (ej: una cuenta en USD) no se mezclan con los totales de la moneda principal.
function mainCurrencyScope(userId: string): Prisma.TransactionWhereInput {
  return { userId, OR: [{ accountId: null }, { account: { currency: APP_CURRENCY } }] };
}

export function listRecentTransactions(userId: string, limit: number = DEFAULT_LIST_LIMIT) {
  return prisma.transaction.findMany({
    where: { userId },
    include: { account: { select: { name: true, currency: true } } },
    orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    take: limit,
  });
}

export function listTransactionsSince(userId: string, since: Date) {
  return prisma.transaction.findMany({ where: { ...mainCurrencyScope(userId), date: { gte: since } }, orderBy: { date: 'asc' } });
}

export async function getCurrentBalance(userId: string): Promise<number> {
  const [totalsByType, accountsOpening] = await Promise.all([
    prisma.transaction.groupBy({ by: ['type'], where: mainCurrencyScope(userId), _sum: { amount: true } }),
    prisma.moneyAccount.aggregate({ where: { userId, currency: APP_CURRENCY }, _sum: { initialBalance: true } }),
  ]);
  const totalFor = (type: string) => totalsByType.find((group) => group.type === type)?._sum.amount ?? 0;
  return (accountsOpening._sum.initialBalance ?? 0) + totalFor('INCOME') - totalFor('EXPENSE');
}

export async function createTransaction(userId: string, input: TransactionInput) {
  const { accountId, debtId, ...fields } = input;

  return prisma.$transaction(async (tx) => {
    if (accountId && !(await tx.moneyAccount.findFirst({ where: { id: accountId, userId }, select: { id: true } }))) {
      throw new InvalidReferenceError('La cuenta seleccionada no existe.');
    }

    const debt = debtId ? await tx.debt.findFirst({ where: { id: debtId, userId } }) : null;
    if (debtId && !debt) throw new InvalidReferenceError('La deuda seleccionada no existe.');

    const created = await tx.transaction.create({
      data: {
        ...fields,
        description: fields.description || `Pago de ${debt?.name ?? 'deuda'}`,
        userId,
        accountId,
        debtId: debt?.id ?? null,
      },
    });

    if (debt && fields.subtype === DEBT_PAYMENT_SUBTYPE) {
      await tx.debt.update({ where: { id: debt.id }, data: applyInstallmentPayment(debt, fields.amount) });
    }
    return created;
  });
}

export function deleteTransaction(userId: string, id: string) {
  return prisma.transaction.deleteMany({ where: { id, userId } });
}
