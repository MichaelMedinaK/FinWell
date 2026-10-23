import type { ReactNode } from 'react';
import { BottomNav } from '@/components/layout/BottomNav';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { Sidebar } from '@/components/layout/Sidebar';
import { requireCompleteUser } from '@/server/auth/session';
import { listDebtAlerts } from '@/server/services/debt-service';

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await requireCompleteUser();
  const alertCount = (await listDebtAlerts(user.id)).length;
  const displayName = user.name ?? user.email;

  return (
    <>
      <Sidebar alertCount={alertCount} userName={displayName} userEmail={user.email} />
      <div className="md:pl-64">
        <MobileHeader userName={displayName} />
        <main className="mx-auto max-w-6xl px-4 pb-28 pt-5 md:px-8 md:pb-10 md:pt-8">{children}</main>
      </div>
      <BottomNav alertCount={alertCount} />
    </>
  );
}
