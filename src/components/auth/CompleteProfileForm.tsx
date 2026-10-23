'use client';

import { Check, Loader2 } from 'lucide-react';
import { useActionState } from 'react';
import { INITIAL_FORM_STATE } from '@/lib/form-state';
import { completeProfileAction } from '@/server/actions/auth-actions';
import { FormField } from '@/components/ui/FormField';
import { FormStatusMessage } from '@/components/ui/FormStatusMessage';
import { useResettableFormSubmit } from '@/components/ui/useResettableFormSubmit';

export function CompleteProfileForm({ maxBirthDate }: { maxBirthDate: string }) {
  const [state, formAction, isPending] = useActionState(completeProfileAction, INITIAL_FORM_STATE);
  const { formRef, handleSubmit } = useResettableFormSubmit(state, formAction);
  const errors = state.errors ?? {};

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" noValidate>
      <FormField label="Fecha de nacimiento" htmlFor="birthDate" error={errors.birthDate}>
        <input id="birthDate" name="birthDate" type="date" max={maxBirthDate} className="form-input" required aria-invalid={Boolean(errors.birthDate)} />
      </FormField>

      <FormStatusMessage state={state} />

      <button type="submit" className="btn-primary w-full" disabled={isPending}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Check className="h-4 w-4" aria-hidden />}
        Continuar
      </button>
    </form>
  );
}
