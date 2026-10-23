import { prisma } from '@/lib/prisma';

export interface NewPasswordUser {
  email: string;
  name: string;
  passwordHash: string;
  birthDate: Date;
}

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      birthDate: true,
      monthlyIncome: true,
      onboardedAt: true,
    },
  });
}

export function createPasswordUser(newUser: NewPasswordUser) {
  return prisma.user.create({ data: newUser, select: { id: true } });
}

export function updateBirthDate(userId: string, birthDate: Date) {
  return prisma.user.update({ where: { id: userId }, data: { birthDate } });
}
