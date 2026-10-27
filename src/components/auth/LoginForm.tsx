'use client';

import { Loader2, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useActionState } from 'react';
import { INITIAL_FORM_STATE } from '@/lib/form-state';
import { loginAction } from '@/server/actions/auth-actions';
import { FormField } from '@/components/ui/FormField';
import { FormStatusMessage } from '@/components/ui/FormStatusMessage';
import { useResettableFormSubmit } from '@/components/ui/useResettableFormSubmit';

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, INITIAL_FORM_STATE);
  const { formRef, handleSubmit } = useResettableFormSubmit(state, formAction);
  const errors = state.errors ?? {};

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" noValidate>
      <FormField label="Correo" htmlFor="email" error={errors.email}>
        <input id="email" name="email" type="email" autoComplete="email" className="form-input" required aria-invalid={Boolean(errors.email)} />
      </FormField>

      <FormField label="Clave" htmlFor="password" error={errors.password}>
        <input id="password" name="password" type="password" autoComplete="current-password" className="form-input" required aria-invalid={Boolean(errors.password)} />
      </FormField>

      <div className="text-right">
        <Link href="/olvide-mi-clave" className="text-sm font-semibold text-emerald-700 hover:underline">
          ¿Olvidaste tu clave?
        </Link>
      </div>

      <FormStatusMessage state={state} />

      <button type="submit" className="btn-primary w-full" disabled={isPending}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <LogIn className="h-4 w-4" aria-hidden />}
        Ingresar
      </button>
    </form>
  );
}
