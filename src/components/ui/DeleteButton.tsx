'use client';

import { Loader2, Trash2 } from 'lucide-react';
import { useTransition } from 'react';

interface DeleteButtonProps {
  action: () => Promise<void>;
  confirmMessage: string;
  label: string;
}

export function DeleteButton({ action, confirmMessage, label }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!window.confirm(confirmMessage)) return;
    startTransition(() => action());
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={label}
      title={label}
      className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Trash2 className="h-4 w-4" aria-hidden />}
    </button>
  );
}
