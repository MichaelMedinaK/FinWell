import type { DebtInput } from '@/lib/validation/debt-input';
import type { DebtDraft } from '@/lib/validation/onboarding-input';

// Se conserva el borrador original para reenviarlo al servidor, que vuelve a validar todo.
export interface OnboardingDebt {
  key: string;
  draft: DebtDraft;
  input: DebtInput;
}
