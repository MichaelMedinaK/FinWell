import { ArrowLeft, ArrowRight } from 'lucide-react';

interface StepNavigationProps {
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
}

export function StepNavigation({ onBack, onNext, nextLabel = 'Continuar' }: StepNavigationProps) {
  return (
    <div className="flex gap-3 pt-2">
      <button type="button" className="btn-secondary" onClick={onBack}>
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Atrás
      </button>
      <button type="button" className="btn-primary flex-1" onClick={onNext}>
        {nextLabel}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
