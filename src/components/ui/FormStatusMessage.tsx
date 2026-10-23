import { CheckCircle2, XCircle } from 'lucide-react';
import type { FormState } from '@/lib/form-state';
import { cn } from '@/lib/cn';

export function FormStatusMessage({ state }: { state: FormState }) {
  if (state.status === 'idle' || !state.message) return null;
  const isSuccess = state.status === 'success';
  const Icon = isSuccess ? CheckCircle2 : XCircle;

  return (
    <p
      role="status"
      className={cn(
        'flex items-center gap-2 rounded-xl px-3 py-2 text-sm',
        isSuccess ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700',
      )}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden />
      {state.message}
    </p>
  );
}
