'use client';

import { Loader2, Mail } from 'lucide-react';
import { useActionState } from 'react';
import { INITIAL_FORM_STATE } from '@/lib/form-state';
import { requestPasswordResetAction } from '@/server/actions/password-reset-actions';
import { FormField } from '@/components/ui/FormField';
import { FormStatusMessage } from '@/components/ui/FormStatusMessage';
import { useResettableFormSubmit } from '@/components/ui/useResettableFormSubmit';

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(requestPasswordResetAction, INITIAL_FORM_STATE);
  const { formRef, handleSubmit } = useResettableFormSubmit(state, formAction);
  const errors = state.errors ?? {};

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" noValidate>
      <FormField label="Correo" htmlFor="email" error={errors.email}>
        <input id="email" name="email" type="email" autoComplete="email" className="form-input" required aria-invalid={Boolean(errors.email)} />
      </FormField>

      <FormStatusMessage state={state} />

      <button type="submit" className="btn-primary w-full" disabled={isPending}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Mail className="h-4 w-4" aria-hidden />}
        Enviar enlace
      </button>
    </form>
  );
}
