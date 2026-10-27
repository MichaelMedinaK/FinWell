import { Briefcase, PiggyBank, Trash2 } from 'lucide-react';
import { INCOME_KIND_LABELS, INCOME_ORIGIN_LABELS, sumMonthlyIncome } from '@/domain/income';
import { formatCurrency } from '@/lib/format';
import type { IncomeSourceInput } from '@/lib/validation/income-source-input';
import { MAX_ONBOARDING_INCOME_SOURCES, type IncomeSourceDraft } from '@/lib/validation/onboarding-input';
import { IncomeDraftForm } from './IncomeDraftForm';
import type { OnboardingIncomeSource } from './onboarding-income';
import { StepHeading } from './StepHeading';
import { StepNavigation } from './StepNavigation';

interface IncomeStepProps {
  incomeSources: OnboardingIncomeSource[];
  onAddIncomeSource: (draft: IncomeSourceDraft, input: IncomeSourceInput) => void;
  onRemoveIncomeSource: (key: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function IncomeStep({ incomeSources, onAddIncomeSource, onRemoveIncomeSource, onBack, onNext }: IncomeStepProps) {
  const canAddMore = incomeSources.length < MAX_ONBOARDING_INCOME_SOURCES;
  const inputs = incomeSources.map((source) => source.input);

  return (
    <div className="space-y-5">
      <StepHeading
        icon={<PiggyBank className="h-6 w-6" aria-hidden />}
        title="¿De dónde viene tu dinero?"
        description="Agrega cada ingreso por separado, fijo o informal. Con un promedio aproximado basta: así sabremos cuánto ganas realmente."
      />

      {incomeSources.length > 0 && (
        <ul className="space-y-2" aria-label="Ingresos agregados">
          {incomeSources.map(({ key, input }) => (
            <li key={key} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-surface p-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <Briefcase className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-800">{input.name}</p>
                <p className="text-xs text-slate-500">
                  {INCOME_ORIGIN_LABELS[input.origin]} · {INCOME_KIND_LABELS[input.kind]} · {formatCurrency(input.monthlyAmount)} al mes
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRemoveIncomeSource(key)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                aria-label={`Quitar ${input.name}`}
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      {incomeSources.length > 0 && (
        <dl className="grid grid-cols-3 gap-2 text-center">
          <Total label="Fijos" value={sumMonthlyIncome(inputs, 'FIXED')} />
          <Total label="Informales" value={sumMonthlyIncome(inputs, 'VARIABLE')} />
          <Total label="Total" value={sumMonthlyIncome(inputs)} highlighted />
        </dl>
      )}

      {canAddMore ? (
        <IncomeDraftForm onAdd={onAddIncomeSource} />
      ) : (
        <p className="rounded-xl bg-slate-50 p-3 text-center text-sm text-slate-500">
          Llegaste al máximo de {MAX_ONBOARDING_INCOME_SOURCES} ingresos.
        </p>
      )}

      <StepNavigation
        onBack={onBack}
        onNext={onNext}
        nextLabel={incomeSources.length === 0 ? 'Prefiero no decirlo' : 'Continuar'}
      />
    </div>
  );
}

function Total({ label, value, highlighted = false }: { label: string; value: number; highlighted?: boolean }) {
  return (
    <div className={highlighted ? 'rounded-xl bg-emerald-50 p-2' : 'rounded-xl bg-slate-50 p-2'}>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className={highlighted ? 'text-sm font-bold text-emerald-800' : 'text-sm font-semibold text-slate-900'}>
        {formatCurrency(value)}
      </dd>
    </div>
  );
}
