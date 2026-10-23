# Guía de uso · FinWell

> Documento vivo: actualízalo cada vez que se agregue o cambie una funcionalidad.
> Última actualización: 23-10-2026 · Versión 0.1.0

## 1. Primeros pasos

1. Abre una terminal en la carpeta del proyecto.
2. Solo la primera vez: `npm install`.
3. Inicia la app con `npm run dev` y abre <http://localhost:3000>.
4. (Opcional) Para probar con datos de ejemplo: `npm run db:seed`. ⚠️ Borra los datos existentes.

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

## 3. Resumen (Inicio)

- **Balance actual**: total de entradas menos total de salidas registradas.
- **Neto del mes**: entradas menos salidas del mes en curso.
- **Entradas / salidas** de hoy y del mes.
- **Pagos próximos**: deudas vencidas o que vencen en los próximos 5 días.
- **Gráficos**: últimos 7 días y últimos 6 meses (verde = entradas, rojo = salidas). Deja el cursor sobre una barra para ver los montos.

## 4. Movimientos

Registra cada entrada (sueldo, ventas…) o salida (compras, cuentas…).

| Campo | Obligatorio | Notas |
|-------|:-----------:|-------|
| Tipo | Sí | Entrada o Salida |
| Monto | Sí | Mayor a 0 |
| Descripción | Sí | Máx. 120 caracteres |
| Categoría | No | Máx. 40 caracteres (ej. Comida, Transporte) |
| Fecha | Sí | Por defecto, hoy |

Para eliminar un movimiento usa el ícono de papelera y confirma. **La eliminación no se puede deshacer.**

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
| `DATABASE_URL` | `file:./dev.db` | Ubicación de la base de datos SQLite |

Reinicia `npm run dev` después de cambiarlas.

## 8. Limitaciones conocidas y próximas mejoras

- No hay edición de deudas ni movimientos (solo crear y eliminar).
- Las alertas se ven dentro de la app; no hay notificaciones push.
- Los datos se guardan localmente en `prisma/dev.db`; para respaldarlos, copia ese archivo.

## 9. Historial de cambios

| Fecha | Versión | Cambios |
|-------|---------|---------|
| 23-10-2026 | 0.1.0 | Versión inicial: resumen, movimientos, deudas/tarjetas, alertas y PWA. |
