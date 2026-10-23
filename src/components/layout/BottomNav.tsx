'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import { AlertCountBadge } from './AlertCountBadge';
import { isActivePath, NAV_ITEMS } from './nav-items';

export function BottomNav({ alertCount }: { alertCount: number }) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      aria-label="Navegación principal"
    >
      <ul className="grid grid-cols-4">
        {NAV_ITEMS.map((item) => {
          const isActive = isActivePath(pathname, item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition',
                  isActive ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-800',
                )}
              >
                <span className="relative">
                  <Icon className="h-6 w-6" aria-hidden strokeWidth={isActive ? 2.4 : 2} />
                  {item.showsAlertCount && (
                    <AlertCountBadge count={alertCount} className="absolute -right-2.5 -top-1.5" />
                  )}
                </span>
                {item.shortLabel}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
