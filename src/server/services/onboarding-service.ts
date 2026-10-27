import { totalMonthlyIncomeOrNull } from '@/domain/income';
import { prisma } from '@/lib/prisma';
import type { OnboardingInput } from '@/lib/validation/onboarding-input';

// Una sola transacción: si algo falla, el usuario no queda marcado como onboarded a medias.
export function completeOnboarding(userId: string, input: OnboardingInput) {
  return prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        monthlyIncome: totalMonthlyIncomeOrNull(input.incomeSources),
        debtEstimatedTotal: input.debtGoal?.estimatedTotal ?? null,
        debtPayoffMonths: input.debtGoal?.payoffMonths ?? null,
        onboardedAt: new Date(),
      },
    }),
    prisma.incomeSource.createMany({ data: input.incomeSources.map((source) => ({ ...source, userId })) }),
    prisma.fixedExpense.createMany({ data: input.fixedExpenses.map((expense) => ({ ...expense, userId })) }),
  ]);
}

export function skipOnboarding(userId: string) {
  return prisma.user.update({ where: { id: userId }, data: { onboardedAt: new Date() } });
}
