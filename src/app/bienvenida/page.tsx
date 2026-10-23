import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { BrandLogo } from '@/components/layout/BrandLogo';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { requireUserWithProfile } from '@/server/auth/session';

export const metadata: Metadata = { title: 'Bienvenida' };

export default async function OnboardingPage() {
  const user = await requireUserWithProfile();
  if (user.onboardedAt) redirect('/');

  const firstName = user.name?.trim().split(/\s+/)[0] || 'bienvenido';

  return (
    <div className="relative flex min-h-dvh flex-col items-center bg-gradient-to-br from-emerald-50 via-surface to-teal-50 px-4 py-8 md:justify-center md:py-12">
      <div className="absolute right-3 top-3">
        <ThemeToggle compact />
      </div>
      <div className="mb-6">
        <BrandLogo />
      </div>
      <main className="w-full max-w-lg rounded-3xl bg-surface p-6 shadow-xl shadow-emerald-900/5 ring-1 ring-slate-200/70 md:p-8">
        <OnboardingWizard userName={firstName} />
      </main>
    </div>
  );
}
