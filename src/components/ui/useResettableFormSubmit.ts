'use client';

import { useEffect, useRef, useTransition, type FormEvent } from 'react';
import type { FormState } from '@/lib/form-state';

/*
 * Envía el formulario manualmente en lugar de usar `<form action>`: React 19 resetea el
 * formulario tras cualquier acción, lo que borraría lo escrito cuando hay errores de validación.
 */
export function useResettableFormSubmit(state: FormState, formAction: (formData: FormData) => void) {
  const formRef = useRef<HTMLFormElement>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (state.status === 'success') formRef.current?.reset();
  }, [state]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  };

  return { formRef, handleSubmit };
}
