import { describe, expect, it } from 'vitest';
import { isThemeMode, nextThemeMode } from '../theme-mode';

describe('nextThemeMode', () => {
  it('rota claro → oscuro → sistema → claro', () => {
    expect(nextThemeMode('light')).toBe('dark');
    expect(nextThemeMode('dark')).toBe('system');
    expect(nextThemeMode('system')).toBe('light');
  });

  it('parte en claro cuando el valor es desconocido o no existe', () => {
    expect(nextThemeMode(undefined)).toBe('light');
    expect(nextThemeMode('sepia')).toBe('light');
  });
});

describe('isThemeMode', () => {
  it('acepta solo los modos soportados', () => {
    expect(isThemeMode('dark')).toBe(true);
    expect(isThemeMode('blue')).toBe(false);
    expect(isThemeMode(undefined)).toBe(false);
  });
});
