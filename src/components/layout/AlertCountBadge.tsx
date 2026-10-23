import { cn } from '@/lib/cn';

const MAX_DISPLAYED_COUNT = 9;

export function AlertCountBadge({ count, className }: { count: number; className?: string }) {
  if (count <= 0) return null;
  return (
    <span
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold leading-none text-white',
        className,
      )}
      aria-label={`${count} alertas`}
    >
      {count > MAX_DISPLAYED_COUNT ? `${MAX_DISPLAYED_COUNT}+` : count}
    </span>
  );
}
