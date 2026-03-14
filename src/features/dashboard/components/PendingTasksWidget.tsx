import { AlertTriangle, ArrowRight, CheckCircle2, Inbox } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PIPELINE_STATS } from '@/features/dashboard/data/mock-dashboard';
import { cn } from '@/lib/utils';

export function PendingTasksWidget() {
  // Bottlenecks are stages where input > output significantly or status is 'partial'
  const bottlenecks = PIPELINE_STATS.filter(
    (s) => (s.input > s.output * 1.2 && s.output > 0) || s.status === 'partial',
  );

  return (
    <div className="rounded-2xl border bg-card p-5 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-foreground text-base">
            Stage Traffic
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitoring flow and bottlenecks
          </p>
        </div>
        <Badge
          variant="secondary"
          className={cn(
            'text-xs px-2 py-0.5 rounded-full border shadow-none',
            bottlenecks.length > 0
              ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-rose-100'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200',
          )}
        >
          {bottlenecks.length > 0
            ? `${bottlenecks.length} Bottlenecks`
            : 'Flow Clear'}
        </Badge>
      </div>

      <div className="flex flex-col gap-2.5">
        {bottlenecks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center gap-2 opacity-60">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            <p className="text-xs text-muted-foreground font-medium">
              All stages operating within capacity
            </p>
          </div>
        ) : (
          bottlenecks.slice(0, 4).map((stage) => {
            const isCritical = stage.input > stage.output * 1.5;

            return (
              <div
                key={stage.stageId}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl border transition-all duration-200',
                  isCritical
                    ? 'bg-rose-50/50 border-rose-100 dark:bg-rose-900/10 dark:border-rose-900/30'
                    : 'bg-muted/30 border-border hover:bg-muted/50',
                )}
              >
                <div
                  className={cn(
                    'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
                    isCritical
                      ? 'bg-rose-100 dark:bg-rose-900/30'
                      : 'bg-blue-100 dark:bg-blue-900/30',
                  )}
                >
                  {isCritical ? (
                    <AlertTriangle className="w-4.5 h-4.5 text-rose-600 dark:text-rose-400" />
                  ) : (
                    <Inbox className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {stage.label}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1 group">
                      In:{' '}
                      <span className="text-foreground font-medium">
                        {stage.input.toLocaleString()}
                      </span>
                    </span>
                    <ArrowRight className="w-2.5 h-2.5 text-muted-foreground/30" />
                    <span className="text-[10px] text-muted-foreground font-medium">
                      Out:{' '}
                      <span
                        className={cn(
                          'font-medium',
                          isCritical ? 'text-rose-600' : 'text-emerald-600',
                        )}
                      >
                        {stage.output.toLocaleString()}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-end">
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-[9px] font-bold uppercase tracking-wider px-1.5 h-4.5 border-none shadow-none',
                      isCritical
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-blue-100 text-blue-700',
                    )}
                  >
                    {isCritical ? 'Critical' : 'Lagging'}
                  </Badge>
                  <span className="text-[9px] text-muted-foreground mt-1 font-medium">
                    {Math.round((stage.output / (stage.input || 1)) * 100)}%
                    output
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
