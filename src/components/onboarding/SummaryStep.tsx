import { ArrowLeft, Loader2, PartyPopper, Rocket } from 'lucide-react';
import { useActionState } from 'react';
import { estimateMonthlyMargin, monthlyPayoffTarget } from '@/domain/debt-payoff';
import { sumFixedExpenses } from '@/domain/fixed-expense';
import { sumMonthlyIncome, totalMonthlyIncomeOrNull } from '@/domain/income';
import { INITIAL_FORM_STATE } from '@/lib/form-state';
import { formatCurrency } from '@/lib/format';
import { parseDebtGoalInput } from '@/lib/validation/debt-goal-input';
import { parseFixedExpenses } from '@/lib/validation/fixed-expense-input';
import { completeOnboardingAction } from '@/server/actions/onboarding-actions';
import { FormStatusMessage } from '@/components/ui/FormStatusMessage';
import type { DebtGoalTexts } from './DebtsStep';
import type { FixedExpenseTexts } from './ExpensesStep';
import type { OnboardingIncomeSource } from './onboarding-income';
import { StepHeading } from './StepHeading';

interface SummaryStepProps {
  incomeSources: OnboardingIncomeSource[];
  debtGoalTexts: DebtGoalTexts;
  expenseTexts: FixedExpenseTexts;
  onBack: () => void;
}

export function SummaryStep({ incomeSources, debtGoalTexts, expenseTexts, onBack }: SummaryStepProps) {
  const [state, formAction, isPending] = useActionState(completeOnboardingAction, INITIAL_FORM_STATE);
  const incomeInputs = incomeSources.map((source) => source.input);
  const monthlyIncome = totalMonthlyIncomeOrNull(incomeInputs);

  const debtGoalResult = parseDebtGoalInput(debtGoalTexts);
  const debtGoal = debtGoalResult.success ? debtGoalResult.data : null;
  const monthlyDebtPayment = debtGoal ? monthlyPayoffTarget(debtGoal.estimatedTotal, debtGoal.payoffMonths) : 0;

  const expensesResult = parseFixedExpenses(expenseTexts);
  const fixedExpensesTotal = expensesResult.success ? sumFixedExpenses(expensesResult.data) : 0;
  const monthlyMargin = estimateMonthlyMargin(monthlyIncome, fixedExpensesTotal, monthlyDebtPayment);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="incomeSources" value={JSON.stringify(incomeSources.map((source) => source.draft))} />
      <input type="hidden" name="debtEstimatedTotal" value={debtGoalTexts.estimatedTotal} />
      <input type="hidden" name="debtPayoffMonths" value={debtGoalTexts.payoffMonths} />
      <input type="hidden" name="fixedExpenses" value={JSON.stringify(expenseTexts)} />

      <StepHeading
        icon={<PartyPopper className="h-6 w-6" aria-hidden />}
        title="¡Todo listo!"
        description="Este es tu punto de partida. Cada mes que sigas tus números estarás un paso más cerca de tus metas."
      />

      <dl className="grid grid-cols-2 gap-3">
        <SummaryItem label="Ingreso mensual" value={monthlyIncome === null ? 'No indicado' : formatCurrency(monthlyIncome)} />
        <SummaryItem label="Fijos / informales" value={`${formatCurrency(sumMonthlyIncome(incomeInputs, 'FIXED'))} / ${formatCurrency(sumMonthlyIncome(incomeInputs, 'VARIABLE'))}`} />
        <SummaryItem label="Deuda aproximada" value={debtGoal ? formatCurrency(debtGoal.estimatedTotal) : 'Sin deudas'} />
        <SummaryItem label="Pago mensual para salir" value={debtGoal ? `${formatCurrency(monthlyDebtPayment)} (${debtGoal.payoffMonths} meses)` : '—'} />
        <SummaryItem label="Gastos fijos al mes" value={formatCurrency(fixedExpensesTotal)} />
        <SummaryItem label="Te quedaría al mes" value={monthlyMargin === null ? 'Sin ingreso indicado' : formatCurrency(monthlyMargin)} />
      </dl>
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
