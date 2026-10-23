'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { AlertCountBadge } from './AlertCountBadge';
import { BrandLogo } from './BrandLogo';
import { isActivePath, NAV_ITEMS } from './nav-items';

interface SidebarProps {
  alertCount: number;
  userName: string;
  userEmail: string;
}

export function Sidebar({ alertCount, userName, userEmail }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-surface md:flex">
      <div className="px-6 py-6">
        <BrandLogo />
      </div>

      <p className="px-6 text-xs font-semibold uppercase tracking-wider text-slate-400">Bienestar financiero</p>
      <nav className="mt-2 flex flex-1 flex-col gap-1 px-3" aria-label="Navegación principal">
        {NAV_ITEMS.map((item) => {
          const isActive = isActivePath(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
              )}
            >
              <Icon className="h-5 w-5" aria-hidden />
              <span className="flex-1">{item.label}</span>
              {item.showsAlertCount && <AlertCountBadge count={alertCount} />}
            </Link>
          );
        })}
      </nav>

      <div className="m-3 rounded-xl bg-slate-50 p-4 text-xs text-slate-500">
        Próximamente: más módulos de bienestar personal.
      </div>

      <div className="border-t border-slate-200 p-3">
        <div className="px-3 pb-2">
          <p className="truncate text-sm font-semibold text-slate-900">{userName}</p>
          <p className="truncate text-xs text-slate-500">{userEmail}</p>
        </div>
        <ThemeToggle />
        <LogoutButton />
      </div>
    </aside>
  );
}
