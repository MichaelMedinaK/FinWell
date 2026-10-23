import { AlertTriangle, Clock, CircleCheck } from 'lucide-react';
import type { DueInfo } from '@/domain/debt';
import { cn } from '@/lib/cn';
import { describeDaysUntilDue, DUE_STATUS_STYLES } from './due-status-presentation';

export function DueStatusBadge({ daysUntilDue, status }: DueInfo) {
  const Icon = status === 'ok' ? CircleCheck : status === 'soon' ? Clock : AlertTriangle;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
        DUE_STATUS_STYLES[status].badge,
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {describeDaysUntilDue(daysUntilDue)}
    </span>
  );
}
