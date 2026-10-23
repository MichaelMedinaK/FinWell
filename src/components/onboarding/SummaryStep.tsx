import { ArrowLeft, Loader2, PartyPopper, Rocket } from 'lucide-react';
import { useActionState } from 'react';
import { sumOutstandingDebt } from '@/domain/debt';
import { sumMonthlyInstallments } from '@/domain/financial-health';
import { INITIAL_FORM_STATE } from '@/lib/form-state';
import { formatCurrency } from '@/lib/format';
import { completeOnboardingAction } from '@/server/actions/onboarding-actions';
import { DebtLoadIndicator } from '@/components/dashboard/DebtLoadIndicator';
import { FormStatusMessage } from '@/components/ui/FormStatusMessage';
import type { OnboardingDebt } from './onboarding-debt';
import { StepHeading } from './StepHeading';

interface SummaryStepProps {
  incomeText: string;
  monthlyIncome: number | null;
  debts: OnboardingDebt[];
  onBack: () => void;
}

export function SummaryStep({ incomeText, monthlyIncome, debts, onBack }: SummaryStepProps) {
  const [state, formAction, isPending] = useActionState(completeOnboardingAction, INITIAL_FORM_STATE);
  const debtInputs = debts.map((debt) => debt.input);
  const monthlyInstallments = sumMonthlyInstallments(debtInputs);
  const serializedDebts = JSON.stringify(debts.map((debt) => debt.draft));

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="monthlyIncome" value={incomeText} />
      <input type="hidden" name="debts" value={serializedDebts} />

      <StepHeading
        icon={<PartyPopper className="h-6 w-6" aria-hidden />}
        title="¡Todo listo!"
        description="Este es tu punto de partida. Cada mes que sigas tus números estarás un paso más cerca de tus metas."
      />

      <dl className="grid grid-cols-2 gap-3">
        <SummaryItem label="Ingreso mensual" value={monthlyIncome === null ? 'No indicado' : formatCurrency(monthlyIncome)} />
        <SummaryItem label="Deudas registradas" value={String(debts.length)} />
        <SummaryItem label="Total adeudado" value={formatCurrency(sumOutstandingDebt(debtInputs))} />
        <SummaryItem label="Cuotas al mes (aprox.)" value={formatCurrency(monthlyInstallments)} />
      </dl>

      {monthlyIncome !== null && debts.length > 0 && (
        <DebtLoadIndicator monthlyIncome={monthlyIncome} monthlyInstallments={monthlyInstallments} className="shadow-none" />
      )}

      <p className="rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 p-4 text-center text-sm font-medium text-emerald-800">
        “No se trata de cuánto ganas, sino de cómo lo organizas.”
      </p>

      <FormStatusMessage state={state} />

      <div className="flex gap-3">
        <button type="button" className="btn-secondary" onClick={onBack} disabled={isPending}>
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Atrás
        </button>
        <button type="submit" className="btn-primary flex-1" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Rocket className="h-4 w-4" aria-hidden />}
          Ir a mi panel
        </button>
      </div>
    </form>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 font-semibold text-slate-900">{value}</dd>
    </div>
  );
}
