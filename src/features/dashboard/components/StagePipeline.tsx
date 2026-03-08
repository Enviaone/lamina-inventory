import { CheckCircle2, Clock, Circle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PIPELINE_STATS } from '@/features/dashboard/data/mock-dashboard';

const STATUS_MAP = {
  done: {
    icon: CheckCircle2,
    iconClass: 'text-green-500',
    label: 'Done',
    progressBar: 'bg-green-500',
  },
  partial: {
    icon: Clock,
    iconClass: 'text-amber-500',
    label: 'In Progress',
    progressBar: 'bg-amber-500',
  },
  pending: {
    icon: Circle,
    iconClass: 'text-slate-300',
    label: 'Pending',
    progressBar: 'bg-slate-200',
  },
};

export function StagePipeline() {
  return (
    <div className="rounded-2xl border bg-card p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
        <div>
          <h2 className="font-semibold text-foreground text-base">
            Today's Pipeline
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Unit flow across all 10 manufacturing stages
          </p>
        </div>
        <div className="flex items-center gap-3">
          {(['done', 'partial', 'pending'] as const).map((s) => {
            const cfg = STATUS_MAP[s];
            return (
              <span
                key={s}
                className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
              >
                <cfg.icon className={cn('w-3 h-3', cfg.iconClass)} />
                {cfg.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Stage grid — 2 cols mobile, 3 sm, 5 lg */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {PIPELINE_STATS.map((stage, idx) => {
          const cfg = STATUS_MAP[stage.status];
          const Icon = cfg.icon;
          const inputBase = Math.max(stage.input, stage.output, 1);
          const progressPct =
            stage.status === 'pending'
              ? 0
              : Math.min(100, Math.round((stage.output / inputBase) * 100));

          return (
            <div
              key={stage.stageId}
              className="rounded-xl border border-border bg-card p-3.5 flex flex-col gap-2.5 hover:shadow-sm transition-shadow cursor-default"
            >
              {/* Stage number + status icon */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-muted-foreground">
                  #{String(idx + 1).padStart(2, '0')}
                </span>
                <Icon className={cn('w-4 h-4', cfg.iconClass)} />
              </div>

              {/* Stage name */}
              <p className="text-xs font-semibold text-foreground leading-tight line-clamp-2">
                {stage.label}
              </p>

              {/* Output value */}
              <div>
                <p
                  className={cn(
                    'text-xl font-extrabold leading-none tracking-tight',
                    stage.status === 'pending'
                      ? 'text-muted-foreground/40'
                      : 'text-foreground',
                  )}
                >
                  {stage.output > 0
                    ? stage.output.toLocaleString('en-IN')
                    : '—'}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  units out
                </p>
              </div>

              {/* Progress bar */}
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-[width] duration-700',
                    cfg.progressBar,
                  )}
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              {/* Rejection badge */}
              {stage.rejections > 0 && (
                <div className="flex items-center gap-1 w-fit">
                  <XCircle className="w-3 h-3 text-rose-500 shrink-0" />
                  <span className="text-[10px] font-medium text-rose-600">
                    {stage.rejections.toLocaleString('en-IN')} rej.
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
