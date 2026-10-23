import { cn } from '@/lib/cn';

export function StepProgress({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div
      className="flex items-center gap-2"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-valuenow={currentStep + 1}
      aria-label={`Paso ${currentStep + 1} de ${totalSteps}`}
    >
      {Array.from({ length: totalSteps }, (_, index) => (
        <span
          key={index}
          className={cn(
            'h-1.5 flex-1 rounded-full transition-colors duration-300',
            index <= currentStep ? 'bg-emerald-500' : 'bg-slate-200',
          )}
        />
      ))}
    </div>
  );
}
