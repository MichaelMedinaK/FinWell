# FinWell · Bienestar personal

PWA responsiva (móvil y escritorio) de bienestar personal. Primer módulo: **Bienestar Financiero**.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS 3 (mobile-first)
- Prisma 6 + PostgreSQL (Docker en local, Supabase en producción)
- Vitest (tests unitarios)

> Requiere Node.js 18.18 o superior y Docker Desktop (para la base local).

## Puesta en marcha

```bash
npm install          # instala dependencias y genera el cliente de Prisma
cp .env.example .env # conexión a la base local (en Windows: copy .env.example .env)
npm run db:up        # levanta PostgreSQL en Docker (puerto 5433)
```

Crea `.env.local` (no se sube a git) con el secreto de sesiones:

```bash
npx auth secret      # genera AUTH_SECRET en .env.local
```

```bash
npm run dev          # aplica migraciones pendientes y levanta http://localhost:3000
```

Opcional:

```bash
npm run db:seed      # crea el usuario demo@finwell.local / demo12345 con datos de ejemplo
npm run db:studio    # explorador visual de la base de datos
npm test             # tests unitarios
npm run typecheck    # verificación de tipos
```

Para cambiar el esquema: edita `prisma/schema.prisma` y ejecuta `npm run db:migrate -- --name <cambio>`.
Para detener la base local: `npm run db:down` (los datos se conservan en el volumen de Docker).

## Despliegue gratuito (Vercel + Supabase)

1. **Supabase** → crea un proyecto. En *Connect* (o *Project Settings › Database*) copia:
   - **Transaction pooler** (puerto 6543) → `DATABASE_URL`, agregando al final `?pgbouncer=true&connection_limit=1`.
   - **Session pooler** (puerto 5432) → `DIRECT_URL` (se usa solo para migraciones).
2. **Vercel** → *Add New › Project* → importa el repositorio de GitHub. En *Environment Variables* agrega
   `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET` (genera uno con `npx auth secret`) y, si usas Google,
   `AUTH_GOOGLE_ID` y `AUTH_GOOGLE_SECRET`.
3. Deploy. El script `vercel-build` aplica las migraciones en Supabase antes de compilar.
4. **Google (opcional)** → en el cliente OAuth agrega la URI de redirección
   `https://<tu-app>.vercel.app/api/auth/callback/google`.

Cada `git push` a la rama principal vuelve a desplegar automáticamente.

La moneda y el locale se configuran en `.env` (`NEXT_PUBLIC_CURRENCY`, `NEXT_PUBLIC_LOCALE`).

## Autenticación (Auth.js v5)

- Registro con correo, nombre, clave (mín. 8 caracteres) y fecha de nacimiento (mín. 13 años).
- Inicio de sesión con correo y clave (bcrypt) o con Google. Sesiones JWT firmadas con `AUTH_SECRET`.
- Cada usuario ve solo sus propios movimientos y deudas.

### Habilitar "Continuar con Google"

1. En [Google Cloud Console](https://console.cloud.google.com/apis/credentials) crea un proyecto y configura la **pantalla de consentimiento OAuth** (tipo Externo).
2. **Crear credenciales → ID de cliente de OAuth → Aplicación web**.
3. URI de redireccionamiento autorizado: `http://localhost:3000/api/auth/callback/google` (agrega también la URL de producción cuando despliegues).
4. Copia el ID y el secreto en `.env.local`:

   ```
   AUTH_GOOGLE_ID="..."
   AUTH_GOOGLE_SECRET="..."
   ```

5. Reinicia `npm run dev`. El botón de Google solo aparece si ambas variables están definidas.

Quien entra con Google por primera vez debe indicar su fecha de nacimiento una única vez. Si el correo ya estaba registrado con clave, debe ingresar con su clave (no se vinculan cuentas automáticamente para evitar suplantaciones).

## Funcionalidades

- **Layout responsive**: barra inferior en móvil, sidebar en escritorio.
- **Tema claro / oscuro / sistema**: botón en la barra lateral, el encabezado móvil y las pantallas de acceso; la preferencia se guarda en el navegador (`next-themes`).
- **Bienvenida (`/bienvenida`)**: asistente de 4 pasos tras el registro para cargar ingreso mensual promedio y deudas conocidas (se puede omitir).
- **Dashboard**: balance actual, entradas/salidas del día y del mes, gráficos de 7 días y 6 meses, y "Carga de deudas" (cuotas / ingreso) si el usuario indicó su ingreso.
- **Movimientos**: registro y eliminación de entradas y salidas.
- **Deudas y tarjetas**: crear, listar y eliminar, con fecha límite de pago e indicador de urgencia.
- **Alertas**: deudas que vencen en los próximos 5 días (y las ya vencidas), con contador en la navegación.
- **PWA**: manifest instalable y service worker (activo en `npm run build && npm start`). Solo cachea recursos estáticos; las páginas con datos privados no se guardan en el dispositivo.

## Documentación

- [docs/GUIA-DE-USO.md](docs/GUIA-DE-USO.md): manual de uso para el usuario final (mantenerlo actualizado).
- [AGENTS.md](AGENTS.md): instrucciones para asistentes de IA (Copilot, Codex, Cursor, Claude Code…).

## Estructura

```
prisma/                 Esquema, migraciones y seed
public/                 Íconos y service worker
src/
  app/(app)/            Rutas privadas: /, /movimientos, /deudas, /alertas
  app/(auth)/           Rutas públicas: /login, /registro, /completar-perfil
  app/bienvenida/       Onboarding inicial (ingreso y deudas)
  auth.ts               Configuración de Auth.js (credenciales + Google)
  components/           UI por módulo (layout, dashboard, debts, transactions, alerts, onboarding, theme, ui)
  domain/               Reglas de negocio puras (fechas, urgencia de deudas, resúmenes, carga de deudas)
  lib/                  Prisma, formato, validación de formularios, paleta de temas (lib/theme)
  server/
    auth/               Sesión, guards (requireCompleteUser, requireUserId) y hash de claves
    actions/            Server Actions (mutaciones)
    services/           Acceso a datos y composición de vistas
```
