import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { toDateKey, today } from '@/domain/dates';
import { GoogleAuthSection } from '@/components/auth/GoogleAuthSection';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { getCurrentUser } from '@/server/auth/session';

export const metadata: Metadata = { title: 'Crear cuenta' };

export default async function RegisterPage() {
  if (await getCurrentUser()) redirect('/');

  return (
    <div className="card space-y-1 p-6 md:p-6">
      <h1 className="text-xl font-bold text-slate-900">Crea tu cuenta</h1>
      <p className="pb-3 text-sm text-slate-500">Solo te pediremos lo esencial.</p>

      <GoogleAuthSection />

      <RegisterForm maxBirthDate={toDateKey(today())} />

      <p className="pt-4 text-center text-sm text-slate-500">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="font-semibold text-emerald-700 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
