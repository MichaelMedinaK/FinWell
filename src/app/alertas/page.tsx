import type { Metadata } from 'next';
import Link from 'next/link';
import { ALERT_WINDOW_DAYS } from '@/domain/debt';
import { AlertsPanel } from '@/components/alerts/AlertsPanel';
import { PageHeader } from '@/components/ui/PageHeader';
import { listDebtAlerts } from '@/server/services/debt-service';

export const metadata: Metadata = { title: 'Alertas' };

export default async function AlertsPage() {
  const alerts = await listDebtAlerts();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alertas de pago"
        description={`Deudas y tarjetas que vencen en los próximos ${ALERT_WINDOW_DAYS} días, además de las ya vencidas.`}
      />
      <AlertsPanel alerts={alerts} />
      <p className="text-sm text-slate-500">
        ¿Pagaste o cambió una fecha?{' '}
        <Link href="/deudas" className="font-medium text-emerald-700 hover:underline">
          Gestiona tus deudas y tarjetas
        </Link>
        .
      </p>
    </div>
  );
}
