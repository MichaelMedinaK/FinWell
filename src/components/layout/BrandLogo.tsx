import { Sprout } from 'lucide-react';

export function BrandLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-sky-600 text-white shadow-sm">
        <Sprout className="h-5 w-5" aria-hidden />
      </span>
      <span className="text-lg font-bold tracking-tight text-slate-900">
        Fin<span className="text-sky-600">Well</span>
      </span>
    </div>
  );
}
