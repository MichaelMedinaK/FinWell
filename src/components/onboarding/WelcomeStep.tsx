import { ArrowRight, CalendarClock, Sparkles, TrendingUp, Wallet } from 'lucide-react';
import { skipOnboardingAction } from '@/server/actions/onboarding-actions';

const BENEFITS = [
  { icon: Wallet, title: 'Conoce tu dinero', description: 'Mira de un vistazo cuánto entra y cuánto sale.' },
  { icon: CalendarClock, title: 'Nunca más un pago atrasado', description: 'Te avisamos antes de cada vencimiento.' },
  { icon: TrendingUp, title: 'Avanza a tu ritmo', description: 'Pequeños pasos que suman grandes logros.' },
];

export function WelcomeStep({ userName, onStart }: { userName: string; onStart: () => void }) {
  return (
    <div className="space-y-6 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-900/20">
        <Sparkles className="h-8 w-8" aria-hidden />
      </span>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">¡Hola, {userName}!</h1>
        <p className="text-lg font-medium text-emerald-700">
          Organiza tus finanzas hoy y disfruta la tranquilidad de mañana.
        </p>
        <p className="text-sm text-slate-500">Cuéntanos lo básico y armamos tu panel. Solo te tomará 1 minuto.</p>
      </div>

      <ul className="space-y-3 text-left">
        {BENEFITS.map(({ icon: Icon, title, description }) => (
          <li key={title} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <span>
              <span className="block text-sm font-semibold text-slate-800">{title}</span>
              <span className="block text-sm text-slate-500">{description}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="space-y-2">
        <button type="button" className="btn-primary w-full" onClick={onStart}>
          Comenzar
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
        <form action={skipOnboardingAction}>
          <button type="submit" className="w-full py-2 text-sm font-medium text-slate-500 transition hover:text-slate-800">
            Omitir por ahora
          </button>
        </form>
      </div>
    </div>
  );
}
