export const THEME_MODES = ['light', 'dark', 'system'] as const;
export type ThemeMode = (typeof THEME_MODES)[number];

export const THEME_MODE_LABELS: Record<ThemeMode, string> = {
  light: 'Claro',
  dark: 'Oscuro',
  system: 'Sistema',
};

export function isThemeMode(value: string | undefined): value is ThemeMode {
  return THEME_MODES.includes(value as ThemeMode);
}

export function nextThemeMode(current: string | undefined): ThemeMode {
  if (!isThemeMode(current)) {
    return THEME_MODES[0];
  }
  return THEME_MODES[(THEME_MODES.indexOf(current) + 1) % THEME_MODES.length];
}
