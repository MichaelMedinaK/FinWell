import type { Metadata } from 'next';
import Link from 'next/link';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { isPasswordResetTokenUsable } from '@/server/services/password-reset-service';

export const metadata: Metadata = { title: 'Crear clave nueva' };

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const isUsable = await isPasswordResetTokenUsable(token);

  return (
    <div className="card space-y-1 p-6 md:p-6">
      <h1 className="text-xl font-bold text-slate-900">Crea tu clave nueva</h1>

      {isUsable ? (
        <>
          <p className="pb-3 text-sm text-slate-500">Elige una clave segura que no uses en otros sitios.</p>
          <ResetPasswordForm token={token} />
        </>
      ) : (
        <>
          <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
            El enlace venció o ya fue usado. Solicita uno nuevo.
          </p>
          <p className="pt-4 text-center text-sm">
            <Link href="/olvide-mi-clave" className="font-semibold text-emerald-700 hover:underline">
              Solicitar otro enlace
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
