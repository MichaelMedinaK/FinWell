# Instrucciones para agentes de IA · FinWell

PWA de bienestar personal (módulo inicial: Bienestar Financiero). Interfaz y textos de usuario en **español**; código (identificadores) en **inglés**.

## Stack y restricciones

- Next.js 15 (App Router) + React 19 + TypeScript estricto, Tailwind CSS 3, Prisma 6 + SQLite, Vitest 3.
- El entorno usa **Node 18**: no actualizar a Next 16, Prisma 7 ni Tailwind 4 (requieren Node 20+).
- No agregar librerías de UI ni de gráficos sin necesidad; los gráficos son barras CSS ([FlowChart.tsx](src/components/dashboard/FlowChart.tsx)).

## Comandos

```bash
npm run dev          # aplica migraciones (predev) y levanta el servidor
npm run typecheck    # tsc --noEmit
npm test             # vitest run
npm run build        # prisma generate + next build
npm run db:migrate -- --name <cambio>   # tras editar prisma/schema.prisma
npm run db:seed      # datos de ejemplo (borra los existentes)
```

Antes de dar un cambio por terminado: `npm run typecheck`, `npm test` y, si toca rutas/UI, `npm run build`.

## Arquitectura (respetar las capas)

| Capa | Ubicación | Responsabilidad |
|------|-----------|-----------------|
| Dominio | `src/domain/` | Reglas de negocio **puras** (sin Prisma ni React). Aquí va toda lógica reutilizable. |
| Validación | `src/lib/validation/` | Convierte `FormData` en datos tipados; devuelve `ValidationResult<T>` con errores por campo en español. |
| Servicios | `src/server/services/` | Acceso a datos con Prisma y composición de vistas. |
| Server Actions | `src/server/actions/` | Mutaciones: validar → persistir → `revalidatePath('/', 'layout')`. |
| UI | `src/components/<módulo>/`, `src/app/<ruta>/` | Server Components por defecto; `'use client'` solo si hay interacción. |

## Convenciones clave

- **Fechas de negocio** en medianoche UTC: usar siempre los helpers de [dates.ts](src/domain/dates.ts) (`parseDateOnly`, `toDateOnly`, `daysBetween`…), nunca `new Date(string)` directo. Formatear con `timeZone: 'UTC'` ([format.ts](src/lib/format.ts)).
- **Alertas**: ventana de 5 días (`ALERT_WINDOW_DAYS` en [debt.ts](src/domain/debt.ts)); las deudas vencidas también se incluyen.
- **SQLite sin enums**: los tipos se guardan como `String` (`DEBT | CREDIT_CARD`, `INCOME | EXPENSE`) y se validan en dominio/validación.
- Los archivos `'use server'` solo exportan funciones async; tipos/constantes compartidos van en [form-state.ts](src/lib/form-state.ts).
- Formularios: `useActionState` + [useResettableFormSubmit.ts](src/components/ui/useResettableFormSubmit.ts) (evita que React 19 borre los campos ante errores de validación).
- Errores: capturar solo errores de Prisma con `isPersistenceError` ([persistence-errors.ts](src/server/persistence-errors.ts)) y relanzar el resto.
- Iconos de `lucide-react` no son serializables: los componentes de navegación cliente importan `NAV_ITEMS` directamente.
- Diseño **mobile-first**: barra inferior en móvil, sidebar desde `md`. Reutilizar las clases `.card`, `.form-input`, `.btn-primary`… de [globals.css](src/app/globals.css).
- Moneda y locale vía `.env` (`NEXT_PUBLIC_CURRENCY`, `NEXT_PUBLIC_LOCALE`), leídos en [config.ts](src/lib/config.ts); no hardcodear CLP.

## Calidad

- SOLID y DRY; nombres descriptivos; comentarios solo para explicar el **por qué**.
- Toda regla nueva de dominio o validación lleva tests en `__tests__/` junto al módulo.
- Solución más simple que resuelva el problema; sin sobreingeniería.

## Documentación

- Al agregar o cambiar una funcionalidad visible para el usuario, actualizar [docs/GUIA-DE-USO.md](docs/GUIA-DE-USO.md).
- Cambios de comandos o estructura → actualizar [README.md](README.md) y este archivo.
