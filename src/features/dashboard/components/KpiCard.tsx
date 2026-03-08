import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  /** Optional prefix e.g. '₹' */
  prefix?: string;
  trend?: {
    value: string;
    positive: boolean;
    neutral?: boolean;
  };
  className?: string;
}

export function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  prefix,
  trend,
  className,
}: KpiCardProps) {
  return (
    <div className={cn('flex flex-col gap-3 p-5', className)}>
      {/* Label row */}
      <div className="flex items-center gap-1.5">
        <Icon
          className="w-4 h-4 text-muted-foreground shrink-0"
          strokeWidth={1.5}
        />
        <span className="text-sm text-muted-foreground font-medium">
          {title}
        </span>
      </div>

      {/* Value */}
      <p className="text-3xl font-bold tracking-tight text-foreground leading-none">
        {prefix && <span className="text-2xl">{prefix}</span>}
        {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
      </p>

      {/* Subtitle / trend */}
      <div className="flex items-center gap-1.5 min-h-4">
        {trend ? (
          <>
            <span
              className={cn(
                'text-xs font-semibold',
                trend.neutral
                  ? 'text-muted-foreground'
                  : trend.positive
                    ? 'text-green-600'
                    : 'text-rose-600',
              )}
            >
              {trend.value}
            </span>
            <span className="text-xs text-muted-foreground">vs last month</span>
          </>
        ) : subtitle ? (
          <span className="text-xs text-muted-foreground">{subtitle}</span>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Wrap multiple KpiCards in this container to get the
 * grouped card with vertical dividers (matching the reference UI).
 */
export function KpiCardGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'bg-card border border-border rounded-2xl overflow-hidden',
        'grid divide-y sm:divide-x divide-border',
        className,
      )}
    >
      {children}
    </div>
  );
}
