import type { ReactNode } from 'react';
import { BrandLogo } from '@/components/layout/BrandLogo';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <div className="absolute right-3 top-3">
        <ThemeToggle compact />
      </div>
      <div className="mb-6">
        <BrandLogo />
      </div>
      <main className="w-full max-w-sm">{children}</main>
    </div>
  );
}
