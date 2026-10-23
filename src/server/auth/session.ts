import { redirect } from 'next/navigation';
import { cache } from 'react';
import { auth } from '@/auth';
import { findUserById } from '@/server/services/user-service';

export const LOGIN_PATH = '/login';
export const COMPLETE_PROFILE_PATH = '/completar-perfil';
export const ONBOARDING_PATH = '/bienvenida';

export async function getSessionUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

export const getCurrentUser = cache(async () => {
  const userId = await getSessionUserId();
  return userId ? findUserById(userId) : null;
});

/*
 * Se consulta la base en cada request (y no solo el JWT) para detectar usuarios eliminados
 * y saber si ya completaron su fecha de nacimiento sin depender de un token desactualizado.
 * cache() evita repetir la consulta cuando layout y página la piden en el mismo render.
 */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect(LOGIN_PATH);
  return user;
}

export async function requireUserWithProfile() {
  const user = await requireUser();
  if (!user.birthDate) redirect(COMPLETE_PROFILE_PATH);
  return user;
}

export async function requireCompleteUser() {
  const user = await requireUserWithProfile();
  if (!user.onboardedAt) redirect(ONBOARDING_PATH);
  return user;
}

// En server actions nunca se asume que la página ya validó la sesión: se pueden invocar directamente.
export async function requireUserId(): Promise<string> {
  const userId = await getSessionUserId();
  if (!userId) redirect(LOGIN_PATH);
  return userId;
}
