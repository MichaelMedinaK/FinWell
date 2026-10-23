<<<<<<< HEAD
# FinWell
FinWell project repository
=======
# FinWell · Bienestar personal

PWA responsiva (móvil y escritorio) de bienestar personal. Primer módulo: **Bienestar Financiero**.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS 3 (mobile-first)
- Prisma 6 + SQLite
- Vitest (tests unitarios)

> Requiere Node.js 18.18 o superior.

## Puesta en marcha

```bash
npm install          # instala dependencias y genera el cliente de Prisma
npm run dev          # aplica migraciones pendientes y levanta http://localhost:3000
```

Opcional:

```bash
npm run db:seed      # carga datos de ejemplo (borra los existentes)
npm run db:studio    # explorador visual de la base de datos
npm test             # tests unitarios
npm run typecheck    # verificación de tipos
```

Para cambiar el esquema: edita `prisma/schema.prisma` y ejecuta `npm run db:migrate -- --name <cambio>`.

La moneda y el locale se configuran en `.env` (`NEXT_PUBLIC_CURRENCY`, `NEXT_PUBLIC_LOCALE`).

## Funcionalidades

- **Layout responsive**: barra inferior en móvil, sidebar en escritorio.
- **Dashboard**: balance actual, entradas/salidas del día y del mes, gráficos de 7 días y 6 meses.
- **Movimientos**: registro y eliminación de entradas y salidas.
- **Deudas y tarjetas**: crear, listar y eliminar, con fecha límite de pago e indicador de urgencia.
- **Alertas**: deudas que vencen en los próximos 5 días (y las ya vencidas), con contador en la navegación.
- **PWA**: manifest instalable y service worker (activo en `npm run build && npm start`).

## Documentación

- [docs/GUIA-DE-USO.md](docs/GUIA-DE-USO.md): manual de uso para el usuario final (mantenerlo actualizado).
- [AGENTS.md](AGENTS.md): instrucciones para asistentes de IA (Copilot, Codex, Cursor, Claude Code…).

## Estructura

```
prisma/                 Esquema, migraciones y seed
public/                 Íconos y service worker
src/
  app/                  Rutas (App Router): /, /movimientos, /deudas, /alertas
  components/           UI por módulo (layout, dashboard, debts, transactions, alerts, ui)
  domain/               Reglas de negocio puras (fechas, urgencia de deudas, resúmenes)
  lib/                  Prisma, formato, validación de formularios
  server/
    actions/            Server Actions (mutaciones)
    services/           Acceso a datos y composición de vistas
```
>>>>>>> bb0795a (Versión inicial de FinWell)
