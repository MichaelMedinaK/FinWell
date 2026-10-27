'use client';

import { KeyRound, Loader2 } from 'lucide-react';
import { useActionState } from 'react';
import { INITIAL_FORM_STATE } from '@/lib/form-state';
import { resetPasswordAction } from '@/server/actions/password-reset-actions';
import { FormField } from '@/components/ui/FormField';
import { FormStatusMessage } from '@/components/ui/FormStatusMessage';
import { useResettableFormSubmit } from '@/components/ui/useResettableFormSubmit';

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, isPending] = useActionState(resetPasswordAction, INITIAL_FORM_STATE);
  const { formRef, handleSubmit } = useResettableFormSubmit(state, formAction);
  const errors = state.errors ?? {};

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" noValidate>
      <input type="hidden" name="token" value={token} />

      <FormField label="Clave nueva" htmlFor="password" error={errors.password}>
        <input id="password" name="password" type="password" autoComplete="new-password" className="form-input" required aria-invalid={Boolean(errors.password)} />
      </FormField>

      <FormField label="Repite la clave" htmlFor="confirmPassword" error={errors.confirmPassword}>
        <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" className="form-input" required aria-invalid={Boolean(errors.confirmPassword)} />
      </FormField>

      <FormStatusMessage state={state} />

      <button type="submit" className="btn-primary w-full" disabled={isPending}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <KeyRound className="h-4 w-4" aria-hidden />}
        Guardar clave nueva
      </button>
    </form>
  );
}
