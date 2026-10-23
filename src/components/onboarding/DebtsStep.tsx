import { CreditCard, Landmark, Trash2 } from 'lucide-react';
import { estimateInstallmentAmount, getDebtTypeLabel } from '@/domain/debt';
import { formatCurrency, formatDate } from '@/lib/format';
import type { DebtInput } from '@/lib/validation/debt-input';
import { MAX_ONBOARDING_DEBTS, type DebtDraft } from '@/lib/validation/onboarding-input';
import { DebtDraftForm } from './DebtDraftForm';
import type { OnboardingDebt } from './onboarding-debt';
import { StepHeading } from './StepHeading';
import { StepNavigation } from './StepNavigation';

interface DebtsStepProps {
  debts: OnboardingDebt[];
  onAddDebt: (draft: DebtDraft, input: DebtInput) => void;
  onRemoveDebt: (key: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function DebtsStep({ debts, onAddDebt, onRemoveDebt, onBack, onNext }: DebtsStepProps) {
  const canAddMore = debts.length < MAX_ONBOARDING_DEBTS;

  return (
    <div className="space-y-5">
      <StepHeading
        icon={<CreditCard className="h-6 w-6" aria-hidden />}
        title="¿Tienes deudas o tarjetas?"
        description="Agrega las que recuerdes. Te avisaremos antes de cada fecha de pago para que nada te tome por sorpresa."
      />

      {debts.length > 0 && (
        <ul className="space-y-2" aria-label="Deudas agregadas">
          {debts.map(({ key, input }) => (
            <li key={key} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-surface p-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                {input.type === 'CREDIT_CARD' ? <CreditCard className="h-5 w-5" aria-hidden /> : <Landmark className="h-5 w-5" aria-hidden />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-800">{input.name}</p>
                <p className="text-xs text-slate-500">
                  {getDebtTypeLabel(input.type)} · {formatCurrency(input.totalAmount)} · cuota aprox.{' '}
                  {formatCurrency(estimateInstallmentAmount(input))} · paga el {formatDate(input.dueDate)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRemoveDebt(key)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                aria-label={`Quitar ${input.name}`}
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      {canAddMore ? (
        <DebtDraftForm onAdd={onAddDebt} />
      ) : (
        <p className="rounded-xl bg-slate-50 p-3 text-center text-sm text-slate-500">
          Llegaste al máximo de {MAX_ONBOARDING_DEBTS}. Podrás agregar más desde la sección Deudas.
        </p>
      )}

      <StepNavigation
        onBack={onBack}
        onNext={onNext}
        nextLabel={debts.length === 0 ? 'No tengo deudas, continuar' : 'Continuar'}
      />
    </div>
  );
}
