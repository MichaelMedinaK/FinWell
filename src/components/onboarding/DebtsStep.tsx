import { CreditCard } from 'lucide-react';
import { useState } from 'react';
import { monthlyPayoffTarget } from '@/domain/debt-payoff';
import { formatCurrency } from '@/lib/format';
import { parseDebtGoalInput, type DebtGoalInput } from '@/lib/validation/debt-goal-input';
import type { FieldErrors } from '@/lib/validation/form-values';
import { FormField } from '@/components/ui/FormField';
import { StepHeading } from './StepHeading';
import { StepNavigation } from './StepNavigation';

export type DebtGoalTexts = {
  estimatedTotal: string;
  payoffMonths: string;
};

interface DebtsStepProps {
  texts: DebtGoalTexts;
  onTextsChange: (texts: DebtGoalTexts) => void;
  onBack: () => void;
  onNext: () => void;
}

export function DebtsStep({ texts, onTextsChange, onBack, onNext }: DebtsStepProps) {
  const [errors, setErrors] = useState<FieldErrors<keyof DebtGoalInput>>({});
  const result = parseDebtGoalInput(texts);
  const goal = result.success ? result.data : null;

  function update(field: keyof DebtGoalTexts, value: string) {
    setErrors({});
    onTextsChange({ ...texts, [field]: value });
  }

  function handleNext() {
    if (!result.success) {
      setErrors(result.errors);
      return;
    }
    onNext();
  }

  return (
    <div className="space-y-5">
      <StepHeading
        icon={<CreditCard className="h-6 w-6" aria-hidden />}
        title="¿Cuánto debes en total?"
        description="Un monto aproximado basta. El detalle de cada deuda o tarjeta lo agregas después desde tu panel."
      />

      <FormField label="Total aproximado que debes" htmlFor="debtEstimatedTotal" error={errors.estimatedTotal} hint="Opcional. Suma todas tus deudas y tarjetas.">
        <input
          id="debtEstimatedTotal"
          type="number"
          inputMode="decimal"
          min="0"
          step="any"
          className="form-input"
          placeholder="0"
          value={texts.estimatedTotal}
          onChange={(event) => update('estimatedTotal', event.target.value)}
          aria-invalid={Boolean(errors.estimatedTotal)}
        />
      </FormField>

      <FormField label="¿En cuántos meses quieres salir de ellas?" htmlFor="debtPayoffMonths" error={errors.payoffMonths}>
        <input
          id="debtPayoffMonths"
          type="number"
          inputMode="numeric"
          min="1"
          step="1"
          className="form-input"
          placeholder="Ej: 12"
          value={texts.payoffMonths}
          onChange={(event) => update('payoffMonths', event.target.value)}
          aria-invalid={Boolean(errors.payoffMonths)}
        />
      </FormField>

      {goal && (
        <p className="rounded-xl bg-emerald-50 p-3 text-center text-sm text-emerald-800">
          Para lograrlo necesitarías pagar unos{' '}
          <strong>{formatCurrency(monthlyPayoffTarget(goal.estimatedTotal, goal.payoffMonths))}</strong> al mes.
        </p>
      )}

      <StepNavigation onBack={onBack} onNext={handleNext} nextLabel={texts.estimatedTotal.trim() === '' ? 'No tengo deudas, continuar' : 'Continuar'} />
    </div>
  );
}
