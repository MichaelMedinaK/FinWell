'use client';

import { useEffect, useRef, useState } from 'react';
import type { IncomeSourceInput } from '@/lib/validation/income-source-input';
import type { IncomeSourceDraft } from '@/lib/validation/onboarding-input';
import { DebtsStep, type DebtGoalTexts } from './DebtsStep';
import { ExpensesStep, type FixedExpenseTexts } from './ExpensesStep';
import { IncomeStep } from './IncomeStep';
import type { OnboardingIncomeSource } from './onboarding-income';
import { StepProgress } from './StepProgress';
import { SummaryStep } from './SummaryStep';
import { WelcomeStep } from './WelcomeStep';

const STEPS = ['welcome', 'income', 'debts', 'expenses', 'summary'] as const;

export function OnboardingWizard({ userName }: { userName: string }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [incomeSources, setIncomeSources] = useState<OnboardingIncomeSource[]>([]);
  const [debtGoalTexts, setDebtGoalTexts] = useState<DebtGoalTexts>({ estimatedTotal: '', payoffMonths: '' });
  const [expenseTexts, setExpenseTexts] = useState<FixedExpenseTexts>({});
  const nextItemKey = useRef(0);

  const currentStep = STEPS[stepIndex];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [stepIndex]);
  const goNext = () => setStepIndex((index) => Math.min(index + 1, STEPS.length - 1));
  const goBack = () => setStepIndex((index) => Math.max(index - 1, 0));

  function addIncomeSource(draft: IncomeSourceDraft, input: IncomeSourceInput) {
    const key = String(nextItemKey.current++);
    setIncomeSources((current) => [...current, { key, draft, input }]);
  }

  function removeIncomeSource(key: string) {
    setIncomeSources((current) => current.filter((source) => source.key !== key));
  }

  return (
    <div className="space-y-6">
      {currentStep !== 'welcome' && <StepProgress currentStep={stepIndex - 1} totalSteps={STEPS.length - 1} />}

      <div key={currentStep} className="animate-fade-in">
        {currentStep === 'welcome' && <WelcomeStep userName={userName} onStart={goNext} />}
        {currentStep === 'income' && (
          <IncomeStep
            incomeSources={incomeSources}
            onAddIncomeSource={addIncomeSource}
            onRemoveIncomeSource={removeIncomeSource}
            onBack={goBack}
            onNext={goNext}
          />
        )}
        {currentStep === 'debts' && (
          <DebtsStep texts={debtGoalTexts} onTextsChange={setDebtGoalTexts} onBack={goBack} onNext={goNext} />
        )}
        {currentStep === 'expenses' && (
          <ExpensesStep texts={expenseTexts} onTextsChange={setExpenseTexts} onBack={goBack} onNext={goNext} />
        )}
        {currentStep === 'summary' && (
          <SummaryStep incomeSources={incomeSources} debtGoalTexts={debtGoalTexts} expenseTexts={expenseTexts} onBack={goBack} />
        )}
      </div>
    </div>
  );
}
