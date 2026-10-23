'use client';

import { useEffect, useState } from 'react';
import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/cn';
import { isThemeMode, nextThemeMode, THEME_MODE_LABELS, type ThemeMode } from '@/lib/theme/theme-mode';

const THEME_MODE_ICONS: Record<ThemeMode, LucideIcon> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  // El tema guardado solo se conoce en el navegador; antes de montar se muestra "Sistema" para que
  // el HTML del servidor y el primer render del cliente coincidan.
  useEffect(() => setIsMounted(true), []);

  const currentMode: ThemeMode = isMounted && isThemeMode(theme) ? theme : 'system';
  const upcomingMode = nextThemeMode(currentMode);
  const Icon = THEME_MODE_ICONS[currentMode];
  const label = `Tema: ${THEME_MODE_LABELS[currentMode]}`;

  return (
    <button
      type="button"
      onClick={() => setTheme(upcomingMode)}
      aria-label={`${label}. Cambiar a ${THEME_MODE_LABELS[upcomingMode]}`}
      title={`${label} (cambiar a ${THEME_MODE_LABELS[upcomingMode]})`}
      className={cn(
        'inline-flex items-center gap-2 rounded-xl text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900',
        compact ? 'p-2' : 'w-full px-3 py-2.5',
      )}
    >
      <Icon className="h-5 w-5" aria-hidden />
      {!compact && <span>{label}</span>}
    </button>
  );
}
