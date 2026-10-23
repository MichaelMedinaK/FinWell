'use client';

import { useEffect, useRef, useState } from 'react';
import type { DebtInput } from '@/lib/validation/debt-input';
import { parseMonthlyIncome, type DebtDraft } from '@/lib/validation/onboarding-input';
import { DebtsStep } from './DebtsStep';
import { IncomeStep } from './IncomeStep';
import type { OnboardingDebt } from './onboarding-debt';
import { StepProgress } from './StepProgress';
import { SummaryStep } from './SummaryStep';
import { WelcomeStep } from './WelcomeStep';

const STEPS = ['welcome', 'income', 'debts', 'summary'] as const;

export function OnboardingWizard({ userName }: { userName: string }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [incomeText, setIncomeText] = useState('');
  const [debts, setDebts] = useState<OnboardingDebt[]>([]);
  const nextDebtKey = useRef(0);

  const currentStep = STEPS[stepIndex];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [stepIndex]);
  const goNext = () => setStepIndex((index) => Math.min(index + 1, STEPS.length - 1));
  const goBack = () => setStepIndex((index) => Math.max(index - 1, 0));

  function addDebt(draft: DebtDraft, input: DebtInput) {
    const key = String(nextDebtKey.current++);
    setDebts((current) => [...current, { key, draft, input }]);
  }

  function removeDebt(key: string) {
    setDebts((current) => current.filter((debt) => debt.key !== key));
  }

  const incomeResult = parseMonthlyIncome(incomeText);

  return (
    <div className="space-y-6">
      {currentStep !== 'welcome' && <StepProgress currentStep={stepIndex - 1} totalSteps={STEPS.length - 1} />}

      <div key={currentStep} className="animate-fade-in">
        {currentStep === 'welcome' && <WelcomeStep userName={userName} onStart={goNext} />}
        {currentStep === 'income' && (
          <IncomeStep incomeText={incomeText} onIncomeTextChange={setIncomeText} onBack={goBack} onNext={goNext} />
        )}
        {currentStep === 'debts' && (
          <DebtsStep debts={debts} onAddDebt={addDebt} onRemoveDebt={removeDebt} onBack={goBack} onNext={goNext} />
        )}
        {currentStep === 'summary' && (
          <SummaryStep
            incomeText={incomeText}
            monthlyIncome={incomeResult.success ? incomeResult.data : null}
            debts={debts}
            onBack={goBack}
          />
        )}
      </div>
    </div>
  );
}
