import { prisma } from '@/lib/prisma';
import type { OnboardingInput } from '@/lib/validation/onboarding-input';

// Una sola transacción: si falla alguna deuda, el usuario no queda marcado como onboarded a medias.
export function completeOnboarding(userId: string, input: OnboardingInput) {
  return prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { monthlyIncome: input.monthlyIncome, onboardedAt: new Date() },
    }),
    prisma.debt.createMany({ data: input.debts.map((debt) => ({ ...debt, userId })) }),
  ]);
}

export function skipOnboarding(userId: string) {
  return prisma.user.update({ where: { id: userId }, data: { onboardedAt: new Date() } });
}
