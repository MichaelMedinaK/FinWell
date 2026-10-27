import tailwindColors from 'tailwindcss/colors';

type Shade = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950';
type PaletteName = 'slate' | 'emerald' | 'teal' | 'rose' | 'red' | 'amber' | 'orange' | 'sky';
type ShadeMapping = Partial<Record<Shade, Shade>>;
export type CssVariables = Record<string, string>;

export const SURFACE_VARIABLE = '--surface';

const NEUTRAL_PALETTE: PaletteName = 'slate';
const ACCENT_PALETTES: readonly PaletteName[] = ['emerald', 'teal', 'rose', 'red', 'amber', 'orange', 'sky'];

// El neutro se invierte completo: así fondos, bordes y textos de los componentes funcionan en
// ambos temas sin agregar variantes `dark:` en cada uno.
const NEUTRAL_DARK_MAPPING: Record<Shade, Shade> = {
  '50': '950',
  '100': '900',
  '200': '800',
  '300': '700',
  '400': '500',
  '500': '400',
  '600': '300',
  '700': '200',
  '800': '100',
  '900': '50',
  '950': '50',
};

// En los acentos solo se invierten los tintes de fondo (50–200) y los tonos de texto (700–800).
// Los tonos medios (300–600) quedan fijos porque se usan como fondos sólidos con texto blanco
// (botones, logo, barras) y deben conservar su contraste.
const ACCENT_DARK_MAPPING: ShadeMapping = {
  '50': '950',
  '100': '900',
  '200': '800',
  '700': '300',
  '800': '200',
};

const DARK_SURFACE_SHADE: Shade = '900';

// Tema claro crema: el blanco puro de Tailwind se confundía con las tarjetas y los fondos.
const LIGHT_SURFACE_HEX = '#fffdf7';
const LIGHT_NEUTRAL_HEX: Partial<Record<Shade, string>> = {
  '50': '#f6efdc',
  '100': '#efe6cf',
  '200': '#e2d6b8',
  '300': '#d1c3a0',
};

// Tema oscuro más negro que el slate de Tailwind (clave = tono del neutro tras la inversión).
const DARK_SURFACE_HEX = '#0a0f14';
const DARK_NEUTRAL_HEX: Partial<Record<Shade, string>> = {
  '50': '#03060a',
  '100': '#0a0f14',
  '200': '#17202a',
  '300': '#222d39',
};

export function hexToRgbChannels(hex: string): string {
  const digits = hex.replace('#', '');
  const value = digits.length === 3 ? [...digits].map((digit) => digit + digit).join('') : digits;
  const red = parseInt(value.slice(0, 2), 16);
  const green = parseInt(value.slice(2, 4), 16);
  const blue = parseInt(value.slice(4, 6), 16);
  return `${red} ${green} ${blue}`;
}

function shadeHex(palette: PaletteName, shade: Shade): string {
  return tailwindColors[palette][shade];
}

function variableName(palette: PaletteName, shade: string): string {
  return `--${palette}-${shade}`;
}

function themedPalettes(): Array<{ palette: PaletteName; mapping: ShadeMapping }> {
  return [
    { palette: NEUTRAL_PALETTE, mapping: NEUTRAL_DARK_MAPPING },
    ...ACCENT_PALETTES.map((palette) => ({ palette, mapping: ACCENT_DARK_MAPPING })),
  ];
}

export function buildThemeVariables(): { light: CssVariables; dark: CssVariables } {
  const light: CssVariables = { [SURFACE_VARIABLE]: hexToRgbChannels(LIGHT_SURFACE_HEX) };
  const dark: CssVariables = { [SURFACE_VARIABLE]: hexToRgbChannels(DARK_SURFACE_HEX) };

  for (const { palette, mapping } of themedPalettes()) {
    const isNeutral = palette === NEUTRAL_PALETTE;
    for (const [shade, darkShade] of Object.entries(mapping) as Array<[Shade, Shade]>) {
      const lightHex = (isNeutral && LIGHT_NEUTRAL_HEX[shade]) || shadeHex(palette, shade);
      const darkHex = (isNeutral && DARK_NEUTRAL_HEX[shade]) || shadeHex(palette, darkShade);
      light[variableName(palette, shade)] = hexToRgbChannels(lightHex);
      dark[variableName(palette, shade)] = hexToRgbChannels(darkHex);
    }
  }

  return { light, dark };
}

function colorFromVariable(name: string): string {
  return `rgb(var(${name}) / <alpha-value>)`;
}

export function buildThemedTailwindColors(): Record<string, string | Record<string, string>> {
  const colors: Record<string, string | Record<string, string>> = { surface: colorFromVariable(SURFACE_VARIABLE) };

  for (const { palette, mapping } of themedPalettes()) {
    colors[palette] = Object.fromEntries(
      Object.keys(mapping).map((shade) => [shade, colorFromVariable(variableName(palette, shade))]),
    );
  }

  return colors;
}
