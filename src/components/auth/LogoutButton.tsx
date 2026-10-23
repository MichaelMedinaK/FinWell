import { LogOut } from 'lucide-react';
import { logoutAction } from '@/server/actions/auth-actions';
import { cn } from '@/lib/cn';

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        aria-label="Cerrar sesión"
        title="Cerrar sesión"
        className={cn(
          'inline-flex items-center gap-2 rounded-xl text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900',
          compact ? 'p-2' : 'w-full px-3 py-2.5',
        )}
      >
        <LogOut className="h-5 w-5" aria-hidden />
        {!compact && <span>Cerrar sesión</span>}
      </button>
    </form>
  );
}
