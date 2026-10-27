import type { IncomeSourceInput } from '@/lib/validation/income-source-input';
import type { IncomeSourceDraft } from '@/lib/validation/onboarding-input';

// Se conserva el borrador original para reenviarlo al servidor, que vuelve a validar todo.
export interface OnboardingIncomeSource {
  key: string;
  draft: IncomeSourceDraft;
  input: IncomeSourceInput;
}
