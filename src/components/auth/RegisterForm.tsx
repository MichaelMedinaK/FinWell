'use client';

import { Loader2, UserPlus } from 'lucide-react';
import { useActionState } from 'react';
import { INITIAL_FORM_STATE } from '@/lib/form-state';
import { PASSWORD_MIN_LENGTH } from '@/lib/validation/user-input';
import { registerAction } from '@/server/actions/auth-actions';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { FormField } from '@/components/ui/FormField';
import { FormStatusMessage } from '@/components/ui/FormStatusMessage';
import { useResettableFormSubmit } from '@/components/ui/useResettableFormSubmit';

export function RegisterForm({ maxBirthDate }: { maxBirthDate: string }) {
  const [state, formAction, isPending] = useActionState(registerAction, INITIAL_FORM_STATE);
  const { formRef, handleSubmit } = useResettableFormSubmit(state, formAction);
  const errors = state.errors ?? {};

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" noValidate>
      <FormField label="Nombre y apellido" htmlFor="name" error={errors.name}>
        <input id="name" name="name" type="text" autoComplete="name" maxLength={80} className="form-input" required aria-invalid={Boolean(errors.name)} />
      </FormField>

      <FormField label="Correo" htmlFor="email" error={errors.email}>
        <input id="email" name="email" type="email" autoComplete="email" className="form-input" required aria-invalid={Boolean(errors.email)} />
      </FormField>

      <FormField label="Clave" htmlFor="password" error={errors.password} hint={`Mínimo ${PASSWORD_MIN_LENGTH} caracteres.`}>
        <PasswordInput id="password" name="password" autoComplete="new-password" minLength={PASSWORD_MIN_LENGTH} required aria-invalid={Boolean(errors.password)} />
      </FormField>

      <FormField label="Fecha de nacimiento" htmlFor="birthDate" error={errors.birthDate}>
        <input id="birthDate" name="birthDate" type="date" max={maxBirthDate} className="form-input" required aria-invalid={Boolean(errors.birthDate)} />
      </FormField>

      <FormStatusMessage state={state} />

      <button type="submit" className="btn-primary w-full" disabled={isPending}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <UserPlus className="h-4 w-4" aria-hidden />}
        Crear cuenta
      </button>
    </form>
  );
}
