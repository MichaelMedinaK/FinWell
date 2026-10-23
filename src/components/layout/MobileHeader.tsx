import { LogoutButton } from '@/components/auth/LogoutButton';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { BrandLogo } from './BrandLogo';

export function MobileHeader({ userName }: { userName: string }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-slate-200 bg-surface/90 px-4 pb-3 pt-[calc(env(safe-area-inset-top)+0.75rem)] backdrop-blur md:hidden">
      <BrandLogo />
      <div className="flex min-w-0 items-center gap-1">
        <span className="truncate text-sm text-slate-600">{userName}</span>
        <ThemeToggle compact />
        <LogoutButton compact />
      </div>
    </header>
  );
}
