import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { GoogleAuthSection } from '@/components/auth/GoogleAuthSection';
import { LoginForm } from '@/components/auth/LoginForm';
import { getCurrentUser } from '@/server/auth/session';

export const metadata: Metadata = { title: 'Iniciar sesión' };

// Auth.js redirige aquí con ?error=<código> cuando falla el ingreso con Google.
const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  OAuthAccountNotLinked: 'Este correo ya está registrado con clave. Ingresa con tu correo y clave.',
};
const GENERIC_OAUTH_ERROR = 'No pudimos iniciar sesión con Google. Intenta nuevamente.';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await getCurrentUser()) redirect('/');

  const { error } = await searchParams;
  const oauthError = error ? (OAUTH_ERROR_MESSAGES[error] ?? GENERIC_OAUTH_ERROR) : null;

  return (
    <div className="card space-y-1 p-6 md:p-6">
      <h1 className="text-xl font-bold text-slate-900">Inicia sesión</h1>
      <p className="pb-3 text-sm text-slate-500">Accede a tu bienestar financiero.</p>

      {oauthError && (
        <p role="alert" className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {oauthError}
        </p>
      )}

      <GoogleAuthSection />

      <LoginForm />

      <p className="pt-4 text-center text-sm text-slate-500">
        ¿No tienes cuenta?{' '}
        <Link href="/registro" className="font-semibold text-emerald-700 hover:underline">
          Regístrate
        </Link>
      </p>
    </div>
  );
}
