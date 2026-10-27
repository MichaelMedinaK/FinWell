import type { Metadata } from 'next';
import Link from 'next/link';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = { title: 'Recuperar clave' };

export default function ForgotPasswordPage() {
  return (
    <div className="card space-y-1 p-6 md:p-6">
      <h1 className="text-xl font-bold text-slate-900">¿Olvidaste tu clave?</h1>
      <p className="pb-3 text-sm text-slate-500">Ingresa tu correo y te enviaremos un enlace para crear una nueva.</p>

      <ForgotPasswordForm />

      <p className="pt-4 text-center text-sm text-slate-500">
        <Link href="/login" className="font-semibold text-emerald-700 hover:underline">
          Volver a iniciar sesión
        </Link>
      </p>
    </div>
  );
}
