import { PrismaClient } from '@prisma/client';
import { addDays, startOfMonthOffset, today } from '../src/domain/dates';
import { hashPassword } from '../src/server/auth/password';

const prisma = new PrismaClient();

// Cuenta solo para desarrollo local; nunca usar estas credenciales en un entorno real.
const DEMO_EMAIL = 'demo@finwell.local';
const DEMO_PASSWORD = 'demo12345';
const DEMO_MONTHLY_INCOME = 1_200_000;

async function seed(): Promise<void> {
  const referenceDay = today();

  const demoUser = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: { monthlyIncome: DEMO_MONTHLY_INCOME, onboardedAt: new Date() },
    create: {
      email: DEMO_EMAIL,
      name: 'Usuario Demo',
      passwordHash: await hashPassword(DEMO_PASSWORD),
      birthDate: new Date(Date.UTC(1992, 4, 14)),
      monthlyIncome: DEMO_MONTHLY_INCOME,
      onboardedAt: new Date(),
    },
  });
  const userId = demoUser.id;

  // Solo se reinician los datos del usuario demo; las cuentas reales no se tocan.
  await prisma.debt.deleteMany({ where: { userId } });
  await prisma.transaction.deleteMany({ where: { userId } });

  await prisma.debt.createMany({
    data: [
      { userId, name: 'Tarjeta Visa', type: 'CREDIT_CARD', totalAmount: 450000, remainingInstallments: 6, interestRate: 2.1, dueDate: addDays(referenceDay, 2) },
      { userId, name: 'Crédito de consumo', type: 'DEBT', totalAmount: 2400000, remainingInstallments: 24, interestRate: 1.4, dueDate: addDays(referenceDay, 4) },
      { userId, name: 'Tarjeta Mastercard', type: 'CREDIT_CARD', totalAmount: 180000, remainingInstallments: 3, interestRate: null, dueDate: addDays(referenceDay, -1) },
      { userId, name: 'Préstamo familiar', type: 'DEBT', totalAmount: 300000, remainingInstallments: 5, interestRate: null, dueDate: addDays(referenceDay, 18) },
    ],
  });

  const transactions = [];
  for (let monthOffset = -5; monthOffset <= 0; monthOffset++) {
    const monthStart = startOfMonthOffset(referenceDay, monthOffset);
    transactions.push(
      { userId, type: 'INCOME', amount: 1200000, description: 'Sueldo', category: 'Trabajo', date: monthStart },
      { userId, type: 'EXPENSE', amount: 350000, description: 'Arriendo', category: 'Vivienda', date: addDays(monthStart, 4) },
      { userId, type: 'EXPENSE', amount: 180000 + Math.abs(monthOffset) * 15000, description: 'Supermercado', category: 'Alimentación', date: addDays(monthStart, 9) },
    );
  }
  for (let dayOffset = -6; dayOffset <= 0; dayOffset++) {
    transactions.push({ userId, type: 'EXPENSE', amount: 4500 + Math.abs(dayOffset) * 1200, description: 'Transporte y café', category: 'Diario', date: addDays(referenceDay, dayOffset) });
  }
  transactions.push({ userId, type: 'INCOME', amount: 85000, description: 'Trabajo freelance', category: 'Extra', date: referenceDay });

  await prisma.transaction.createMany({ data: transactions });
}

seed()
  .then(() => console.log(`Datos de ejemplo cargados. Ingresa con ${DEMO_EMAIL} / ${DEMO_PASSWORD}`))
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
