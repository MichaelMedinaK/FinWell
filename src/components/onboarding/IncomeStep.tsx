import { PiggyBank } from 'lucide-react';
import { useState } from 'react';
import { formatCurrency } from '@/lib/format';
import { parseMonthlyIncome } from '@/lib/validation/onboarding-input';
import { FormField } from '@/components/ui/FormField';
import { StepHeading } from './StepHeading';
import { StepNavigation } from './StepNavigation';

interface IncomeStepProps {
  incomeText: string;
  onIncomeTextChange: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function IncomeStep({ incomeText, onIncomeTextChange, onBack, onNext }: IncomeStepProps) {
  const [error, setError] = useState<string>();
  const incomeResult = parseMonthlyIncome(incomeText);
  const previewAmount = incomeResult.success ? incomeResult.data : null;

  function handleNext() {
    if (!incomeResult.success) {
      setError(incomeResult.error);
      return;
    }
    onNext();
  }

  return (
    <div className="space-y-5">
      <StepHeading
        icon={<PiggyBank className="h-6 w-6" aria-hidden />}
        title="¿Cuánto ganas al mes?"
        description="Un promedio aproximado basta. Lo usamos para mostrarte qué parte de tu ingreso se va en cuotas."
      />

      <FormField label="Ingreso mensual promedio" htmlFor="monthlyIncome" error={error} hint="Opcional. Solo tú puedes verlo.">
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-lg font-semibold text-slate-400">
            $
          </span>
          <input
            id="monthlyIncome"
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            className="form-input py-3 pl-8 text-lg font-semibold"
            placeholder="0"
            value={incomeText}
            onChange={(event) => {
              setError(undefined);
              onIncomeTextChange(event.target.value);
            }}
            aria-invalid={Boolean(error)}
          />
        </div>
      </FormField>

      {previewAmount !== null && (
        <p className="rounded-xl bg-emerald-50 p-3 text-center text-sm text-emerald-800">
          Ingreso mensual: <strong>{formatCurrency(previewAmount)}</strong>
        </p>
      )}

      <StepNavigation
        onBack={onBack}
        onNext={handleNext}
        nextLabel={incomeText.trim() === '' ? 'Prefiero no decirlo' : 'Continuar'}
      />
    </div>
  );
}
