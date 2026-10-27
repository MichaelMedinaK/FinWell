import { Receipt } from 'lucide-react';
import { useState } from 'react';
import { FIXED_EXPENSE_CATEGORIES, FIXED_EXPENSE_LABELS, sumFixedExpenses, type FixedExpenseCategory } from '@/domain/fixed-expense';
import { formatCurrency } from '@/lib/format';
import { parseFixedExpenses } from '@/lib/validation/fixed-expense-input';
import type { FieldErrors } from '@/lib/validation/form-values';
import { FormField } from '@/components/ui/FormField';
import { StepHeading } from './StepHeading';
import { StepNavigation } from './StepNavigation';

export type FixedExpenseTexts = Record<string, string>;

interface ExpensesStepProps {
  texts: FixedExpenseTexts;
  onTextsChange: (texts: FixedExpenseTexts) => void;
  onBack: () => void;
  onNext: () => void;
}

export function ExpensesStep({ texts, onTextsChange, onBack, onNext }: ExpensesStepProps) {
  const [errors, setErrors] = useState<FieldErrors<FixedExpenseCategory>>({});
  const result = parseFixedExpenses(texts);
  const total = result.success ? sumFixedExpenses(result.data) : 0;

  function update(category: FixedExpenseCategory, value: string) {
    setErrors({});
    onTextsChange({ ...texts, [category]: value });
  }

  function handleNext() {
    if (!result.success) {
      setErrors(result.errors);
      return;
    }
    onNext();
  }

  const hasAmounts = result.success && result.data.length > 0;

  return (
    <div className="space-y-5">
      <StepHeading
        icon={<Receipt className="h-6 w-6" aria-hidden />}
        title="Tus gastos fijos del mes"
        description="Lo que pagas todos los meses sí o sí. Completa solo lo que aplique y con valores aproximados."
      />

      <div className="grid grid-cols-2 gap-3">
        {FIXED_EXPENSE_CATEGORIES.map((category) => (
          <FormField key={category} label={FIXED_EXPENSE_LABELS[category]} htmlFor={`expense-${category}`} error={errors[category]}>
            <input
              id={`expense-${category}`}
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              className="form-input"
              placeholder="0"
              value={texts[category] ?? ''}
              onChange={(event) => update(category, event.target.value)}
              aria-invalid={Boolean(errors[category])}
            />
          </FormField>
        ))}
      </div>

      {hasAmounts && (
        <p className="rounded-xl bg-emerald-50 p-3 text-center text-sm text-emerald-800">
          Gastos fijos al mes: <strong>{formatCurrency(total)}</strong>
        </p>
      )}

      <StepNavigation onBack={onBack} onNext={handleNext} nextLabel={hasAmounts ? 'Continuar' : 'Prefiero no decirlo'} />
    </div>
  );
}
