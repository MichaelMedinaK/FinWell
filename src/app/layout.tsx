import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { BottomNav } from '@/components/layout/BottomNav';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { Sidebar } from '@/components/layout/Sidebar';
import { ServiceWorkerRegistrar } from '@/components/pwa/ServiceWorkerRegistrar';
import { listDebtAlerts } from '@/server/services/debt-service';
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

// Todas las vistas leen datos vivos de la base local; no tiene sentido pre-renderizarlas en build.
export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }: { children: ReactNode }) {
  const alertCount = (await listDebtAlerts()).length;

  return (
    <html lang="es">
      <body>
        <Sidebar alertCount={alertCount} />
        <div className="md:pl-64">
          <MobileHeader />
          <main className="mx-auto max-w-6xl px-4 pb-28 pt-5 md:px-8 md:pb-10 md:pt-8">{children}</main>
        </div>
        <BottomNav alertCount={alertCount} />
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
