import { describe, expect, it } from 'vitest';
import tailwindColors from 'tailwindcss/colors';
import { buildThemedTailwindColors, buildThemeVariables, hexToRgbChannels, SURFACE_VARIABLE } from '../theme-palette';

describe('hexToRgbChannels', () => {
  it('convierte un hex en canales RGB separados por espacio', () => {
    expect(hexToRgbChannels('#059669')).toBe('5 150 105');
    expect(hexToRgbChannels('#ffffff')).toBe('255 255 255');
    expect(hexToRgbChannels('#fff')).toBe('255 255 255');
  });
});

describe('buildThemeVariables', () => {
  const { light, dark } = buildThemeVariables();

  it('en claro usa los colores originales de Tailwind', () => {
    expect(light['--slate-900']).toBe(hexToRgbChannels(tailwindColors.slate[900]));
    expect(light[SURFACE_VARIABLE]).toBe('255 255 255');
  });

  it('en oscuro invierte el neutro y oscurece la superficie', () => {
    expect(dark['--slate-900']).toBe(hexToRgbChannels(tailwindColors.slate[50]));
    expect(dark['--slate-50']).toBe(hexToRgbChannels(tailwindColors.slate[950]));
    expect(dark[SURFACE_VARIABLE]).toBe(hexToRgbChannels(tailwindColors.slate[900]));
  });

  it('en oscuro invierte tintes y textos de acento pero no los tonos sólidos', () => {
    expect(dark['--emerald-50']).toBe(hexToRgbChannels(tailwindColors.emerald[950]));
    expect(dark['--rose-700']).toBe(hexToRgbChannels(tailwindColors.rose[300]));
    expect(dark['--emerald-600']).toBeUndefined();
  });

  it('define las mismas variables en ambos temas', () => {
    expect(Object.keys(dark).sort()).toEqual(Object.keys(light).sort());
  });
});

describe('buildThemedTailwindColors', () => {
  it('expone cada tono temático como variable CSS con soporte de opacidad', () => {
    const colors = buildThemedTailwindColors();
    expect(colors.surface).toBe('rgb(var(--surface) / <alpha-value>)');
    expect(colors.emerald).toEqual(expect.objectContaining({ '700': 'rgb(var(--emerald-700) / <alpha-value>)' }));
  });
});
