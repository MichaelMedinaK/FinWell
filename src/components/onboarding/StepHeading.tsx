import type { ReactNode } from 'react';

export function StepHeading({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="space-y-2">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">{icon}</span>
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  );
}
