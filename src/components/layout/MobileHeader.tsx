import { BrandLogo } from './BrandLogo';

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 pb-3 pt-[calc(env(safe-area-inset-top)+0.75rem)] backdrop-blur md:hidden">
      <BrandLogo />
    </header>
  );
}
