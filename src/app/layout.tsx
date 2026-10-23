import type { ReactNode } from 'react';
import { ServiceWorkerRegistrar } from '@/components/pwa/ServiceWorkerRegistrar';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'FinWell · Bienestar personal', template: '%s · FinWell' },
  description: 'Gestiona tu bienestar financiero: movimientos, deudas, tarjetas y avisos de pago.',
  applicationName: 'FinWell',
  appleWebApp: { capable: true, title: 'FinWell', statusBarStyle: 'default' },
};

export const viewport: Viewport = {
  themeColor: '#059669',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

// Todas las vistas dependen de la sesión y de datos vivos; no tiene sentido pre-renderizarlas en build.
export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // suppressHydrationWarning: next-themes agrega la clase del tema en <html> antes de hidratar.
    <html lang="es" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
