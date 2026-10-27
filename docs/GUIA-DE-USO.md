# Guía de uso · FinWell

> Documento vivo: actualízalo cada vez que se agregue o cambie una funcionalidad.
> Última actualización: 27-10-2026 · Versión 0.7.0

## 1. Primeros pasos

1. Abre una terminal en la carpeta del proyecto y asegúrate de tener **Docker Desktop** abierto.
2. Solo la primera vez: `npm install`, copia `.env.example` como `.env` y ejecuta `npx auth secret` (crea el secreto de sesiones en `.env.local`).
3. Levanta la base de datos con `npm run db:up`, inicia la app con `npm run dev` y abre <http://localhost:3000>.
4. (Opcional) Para probar con datos de ejemplo: `npm run db:seed` e ingresa con **demo@finwell.local / demo12345**. ⚠️ Reinicia los datos de esa cuenta demo.

### Crear cuenta e iniciar sesión

- **Registro** (`/registro`): nombre, correo, clave (mínimo 8 caracteres) y fecha de nacimiento (mínimo 13 años).
- **Inicio de sesión** (`/login`): correo y clave, o el botón **Continuar con Google** (visible solo si está configurado, ver README).
- La primera vez que entras con Google se te pedirá tu **fecha de nacimiento**.
- Si tu correo ya está registrado con clave, ingresa con tu clave (no con Google).
- **Cerrar sesión**: en la barra lateral (PC) o el ícono de salida en la parte superior (celular).
- Cada cuenta ve solo sus propios movimientos y deudas.

### Bienvenida (primer ingreso)

Al crear tu cuenta verás un asistente rápido de 5 pasos:

1. **Bienvenida**.
2. **Tus ingresos**: agrega cada origen (sueldo, negocio, trabajos informales…) indicando si es **fijo** o **informal / variable** y su monto promedio mensual. FinWell suma el total.
3. **Tus deudas**: monto aproximado total y en cuánto tiempo quieres salir de ellas (el detalle de cada deuda se carga después en **Deudas**).
4. **Gastos fijos**: gastos mensuales aproximados que no son deudas (luz, agua, arriendo…).
5. **Resumen**: revisa todo y pulsa **Ir a mi panel**.

Puedes pulsar **Omitir por ahora**. Si indicaste ingresos, el Resumen mostrará la tarjeta **Carga de deudas** (menos de 30 % saludable, 30–49 % moderada, 50 % o más alta).

### Instalar como app en el celular o PC

La instalación como app (PWA) funciona en modo producción:

```bash
npm run build
npm start
```

Luego, en el navegador, elige **"Instalar aplicación"** (PC) o **"Agregar a pantalla de inicio"** (celular).

## 2. Navegación

| Dispositivo | Menú |
|-------------|------|
| Celular | Barra inferior: Inicio · Movimientos · Deudas · Alertas |
| PC / tablet | Barra lateral izquierda: Resumen · Movimientos · Deudas y tarjetas · Alertas |

El número rojo sobre **Alertas** indica cuántos pagos requieren atención.

### Tema claro / oscuro

Toca el botón de sol / luna / monitor (en la barra lateral en PC, arriba a la derecha en el celular y en las pantallas de acceso) para pasar por **Claro → Oscuro → Sistema**. "Sistema" sigue la configuración de tu dispositivo. La elección queda guardada en ese navegador.

## 3. Resumen (Inicio)

El panel principal permite registrar todo sin cambiar de pantalla:

- **Registrar movimiento**: elige Entrada o Salida y su tipo. Salidas: *gasto diario*, *pago de una deuda agendada*, *gasto fijo* u *otro*. Entradas: *fijo*, *variable / informal* u *otro*. Opcionalmente indica la cuenta. Al pagar una deuda, FinWell descuenta el monto adeudado, baja una cuota y mueve el próximo vencimiento un mes.
- **Mis cuentas**: crea cuentas (banco, Mercado Pago, efectivo, dólares físicos…) con su moneda y saldo actual. Los movimientos asociados a una cuenta actualizan su saldo. Eliminar una cuenta borra también sus movimientos.
- **Balance actual**: saldos iniciales de tus cuentas en la moneda principal más entradas menos salidas. Las cuentas en otra moneda (ej. USD) se muestran solo en su propio saldo y no entran al balance.
- **Neto del mes**, **entradas / salidas** de hoy y del mes.
- **Pagos próximos** y **gráficos** de 7 días y 6 meses.

## 4. Movimientos

Lista de los últimos movimientos con el mismo formulario de registro.

| Campo | Obligatorio | Notas |
|-------|:-----------:|-------|
| Tipo y subtipo | Sí | Ver sección Resumen |
| Deuda | Solo en pago de deuda | La descripción es opcional en ese caso |
| Monto | Sí | Mayor a 0 |
| Cuenta | No | Define el saldo que cambia |
| Descripción | Sí | Máx. 120 caracteres |
| Categoría | No | Máx. 40 caracteres |
| Fecha | Sí | Por defecto, hoy |

Para eliminar un movimiento usa la papelera. **No se puede deshacer** (el saldo de la cuenta se recalcula, pero una deuda ya pagada no se revierte).

## 5. Deudas y tarjetas de crédito

| Campo | Obligatorio | Notas |
|-------|:-----------:|-------|
| Nombre | Sí | Ej. "Tarjeta Visa" (máx. 80 caracteres) |
| Tipo | Sí | Deuda o Tarjeta de crédito |
| Monto total | Sí | Mayor a 0 |
| Cuotas restantes | Sí | Número entero, mínimo 1 |
| Tasa de interés % | No | Entre 0 y 100 |
| Fecha límite de pago | Sí | Próximo vencimiento |

- La **cuota aproximada** se calcula como *monto total ÷ cuotas restantes*.
- Si un dato es inválido, se muestra el error bajo el campo y se conserva lo escrito.
- Para eliminar, usa el ícono de papelera y confirma.

### Indicadores de vencimiento

Cada deuda muestra un texto ("Vence hoy", "Vence en 3 días", "Venció ayer"…) con un color según la urgencia:

| Color | Significado |
|-------|-------------|
| 🔴 Rojo | Vencida: la fecha límite ya pasó |
| 🟠 Naranjo | Urgente: vence hoy o en 2 días o menos |
| 🟡 Amarillo | Próxima: vence en 3 a 5 días |
| 🟢 Verde | Al día: faltan más de 5 días |

> Por ahora no se puede editar una deuda: después de pagar una cuota, elimínala y vuelve a crearla con la nueva fecha y cuotas (ver sección 8).

## 6. Alertas

Lista todas las deudas **vencidas** o que vencen en los **próximos 5 días**, de la más urgente a la menos urgente.

## 7. Configuración

En el archivo `.env` de la raíz del proyecto:

| Variable | Ejemplo | Uso |
|----------|---------|-----|
| `NEXT_PUBLIC_CURRENCY` | `CLP`, `USD`, `EUR` | Moneda en que se muestran los montos |
| `NEXT_PUBLIC_LOCALE` | `es-CL`, `es-MX`, `es-ES` | Formato de números y fechas |
| `DATABASE_URL` | `postgresql://finwell:finwell@localhost:5433/finwell` | Conexión a PostgreSQL usada por la app |
| `DIRECT_URL` | igual que `DATABASE_URL` en local | Conexión usada por las migraciones |

`.env` tampoco se sube a git; usa `.env.example` como plantilla. En producción estas variables se configuran en Vercel (ver README).

En `.env.local` (privado, no se sube a git):

| Variable | Uso |
|----------|-----|
| `AUTH_SECRET` | Firma las sesiones (obligatoria) |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Habilitan el ingreso con Google (opcional) |
| `GMAIL_USER` / `GMAIL_APP_PASSWORD` | Envían el correo de recuperación de clave (contraseña de aplicación de Google) |
| `APP_URL` | URL pública para el enlace del correo (opcional; en Vercel se detecta) |

Reinicia `npm run dev` después de cambiarlas. Sin las variables de Gmail, en desarrollo el enlace de recuperación se imprime en la consola del servidor.

### Recuperar la clave

1. En **Iniciar sesión** pulsa **¿Olvidaste tu clave?** e ingresa tu correo.
2. Recibirás un enlace válido por 60 minutos y de un solo uso (siempre se muestra el mismo aviso, exista o no el correo).
3. Elige la clave nueva; luego inicia sesión.

Si el servidor falla al iniciar sesión, la app muestra "No pudimos conectar con el servidor". Los errores de ingreso son explícitos: "No existe una cuenta con este correo" (bajo Correo), "La clave es incorrecta" (bajo Clave) o "Esta cuenta se creó con Google" si nunca definió una clave. En los campos de clave, el ojo permite ver lo que escribes.

## 8. Limitaciones conocidas y próximas mejoras

- No hay edición de deudas ni movimientos (solo crear y eliminar).
- Las alertas se ven dentro de la app; no hay notificaciones push.
- En local, los datos viven en el volumen Docker `finwell-db-data`; en producción, en Supabase.
- Aún no hay verificación de correo.
- Sin conexión, la app no muestra datos (por privacidad no se guardan páginas en el dispositivo).

## 9. Historial de cambios

| Fecha | Versión | Cambios |
|-------|---------|---------|
| 23-10-2026 | 0.1.0 | Versión inicial: resumen, movimientos, deudas/tarjetas, alertas y PWA. |
| 23-10-2026 | 0.2.0 | Registro e inicio de sesión (correo/clave y Google), completar perfil, cerrar sesión y datos por usuario. Se eliminó la caché offline de páginas. |
| 23-10-2026 | 0.3.0 | Asistente de bienvenida (ingreso mensual y deudas conocidas) y tarjeta "Carga de deudas" en el Resumen. |
| 23-10-2026 | 0.4.0 | Tema claro, oscuro o según el sistema, con botón para cambiarlo. |
| 23-10-2026 | 0.5.0 | Base de datos PostgreSQL (Docker en local, Supabase en producción) y despliegue en Vercel. |
| 28-10-2026 | 0.7.0 | Onboarding con ingresos fijos/informales, meta de deudas y gastos fijos; tema verde/azul; registro rápido con tipos de movimiento, pago de deudas y cuentas de dinero. |
| 27-10-2026 | 0.6.0 | Recuperación de clave por correo (Gmail) y mensajes de error de inicio de sesión que distinguen clave incorrecta de falla del servidor. |
