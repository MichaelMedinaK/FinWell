import { isGoogleAuthEnabled } from '@/auth';
import { AuthDivider, GoogleSignInButton } from '@/components/auth/GoogleSignInButton';

// En desarrollo se avisa explícitamente: un botón que simplemente "no aparece" confunde a quien levanta el proyecto.
const shouldShowSetupHint = process.env.NODE_ENV === 'development';

export function GoogleAuthSection() {
  if (isGoogleAuthEnabled) {
    return (
      <>
        <GoogleSignInButton />
        <AuthDivider />
      </>
    );
  }

  if (!shouldShowSetupHint) return null;

  return (
    <p className="mb-3 rounded-xl border border-dashed border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800">
      <strong>Google no configurado.</strong> Completa <code>AUTH_GOOGLE_ID</code> y <code>AUTH_GOOGLE_SECRET</code> en{' '}
      <code>.env.local</code> y reinicia <code>npm run dev</code> (ver README). Este aviso solo se ve en desarrollo.
    </p>
  );
}
