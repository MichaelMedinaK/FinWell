import { PrismaClient } from '@prisma/client';
import { addDays, startOfMonthOffset, today } from '../src/domain/dates';

const prisma = new PrismaClient();

async function seed(): Promise<void> {
  const referenceDay = today();

  await prisma.debt.deleteMany();
  await prisma.transaction.deleteMany();

  await prisma.debt.createMany({
    data: [
      { name: 'Tarjeta Visa', type: 'CREDIT_CARD', totalAmount: 450000, remainingInstallments: 6, interestRate: 2.1, dueDate: addDays(referenceDay, 2) },
      { name: 'Crédito de consumo', type: 'DEBT', totalAmount: 2400000, remainingInstallments: 24, interestRate: 1.4, dueDate: addDays(referenceDay, 4) },
      { name: 'Tarjeta Mastercard', type: 'CREDIT_CARD', totalAmount: 180000, remainingInstallments: 3, interestRate: null, dueDate: addDays(referenceDay, -1) },
      { name: 'Préstamo familiar', type: 'DEBT', totalAmount: 300000, remainingInstallments: 5, interestRate: null, dueDate: addDays(referenceDay, 18) },
    ],
  });

  const transactions = [];
  for (let monthOffset = -5; monthOffset <= 0; monthOffset++) {
    const monthStart = startOfMonthOffset(referenceDay, monthOffset);
    transactions.push(
      { type: 'INCOME', amount: 1200000, description: 'Sueldo', category: 'Trabajo', date: monthStart },
      { type: 'EXPENSE', amount: 350000, description: 'Arriendo', category: 'Vivienda', date: addDays(monthStart, 4) },
      { type: 'EXPENSE', amount: 180000 + Math.abs(monthOffset) * 15000, description: 'Supermercado', category: 'Alimentación', date: addDays(monthStart, 9) },
    );
  }
  for (let dayOffset = -6; dayOffset <= 0; dayOffset++) {
    transactions.push({ type: 'EXPENSE', amount: 4500 + Math.abs(dayOffset) * 1200, description: 'Transporte y café', category: 'Diario', date: addDays(referenceDay, dayOffset) });
  }
  transactions.push({ type: 'INCOME', amount: 85000, description: 'Trabajo freelance', category: 'Extra', date: referenceDay });

  await prisma.transaction.createMany({ data: transactions });
}

seed()
  .then(() => console.log('Datos de ejemplo cargados.'))
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
