import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { toDateKey, today } from '@/domain/dates';
import { CompleteProfileForm } from '@/components/auth/CompleteProfileForm';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { requireUser } from '@/server/auth/session';

export const metadata: Metadata = { title: 'Completa tu perfil' };

export default async function CompleteProfilePage() {
  const user = await requireUser();
  if (user.birthDate) redirect('/');

  return (
    <div className="card space-y-1 p-6 md:p-6">
      <h1 className="text-xl font-bold text-slate-900">¡Hola{user.name ? `, ${user.name}` : ''}!</h1>
      <p className="pb-3 text-sm text-slate-500">Para terminar tu registro, indícanos tu fecha de nacimiento.</p>

      <CompleteProfileForm maxBirthDate={toDateKey(today())} />

      <div className="pt-3">
        <LogoutButton />
      </div>
    </div>
  );
}
