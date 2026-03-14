import { CheckCircle2, Clock, Circle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PIPELINE_STATS } from '@/features/dashboard/data/mock-dashboard';
import { Badge } from '@/components/ui/badge';

const STATUS_MAP = {
  done: {
    icon: CheckCircle2,
    color: 'emerald',
    iconClass: 'text-emerald-500',
    bgClass: 'bg-emerald-500/10',
    borderClass: 'border-emerald-500/20',
    glowClass: 'shadow-emerald-500/20',
    label: 'Done',
    progressBar: 'bg-emerald-500',
  },
  partial: {
    icon: Clock,
    color: 'amber',
    iconClass: 'text-amber-500',
    bgClass: 'bg-amber-500/10',
    borderClass: 'border-amber-500/20',
    glowClass: 'shadow-amber-500/20',
    label: 'In Progress',
    progressBar: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]',
  },
  pending: {
    icon: Circle,
    color: 'slate',
    iconClass: 'text-slate-300',
    bgClass: 'bg-slate-50',
    borderClass: 'border-slate-200',
    glowClass: 'shadow-none',
    label: 'Pending',
    progressBar: 'bg-slate-200',
  },
  rejected: {
    icon: Circle,
    color: 'red',
    iconClass: 'text-red-300',
    bgClass: 'bg-red-50',
    borderClass: 'border-red-200',
    glowClass: 'shadow-none',
    label: 'Rejected',
    progressBar: 'bg-red-200',
  },
} as const;

export function StagePipeline() {
  return (
    <div className="rounded-2xl border bg-card p-4 sm:p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-32 -mb-32 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8 relative z-10">
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-foreground text-base sm:text-lg tracking-tight flex items-center gap-2">
            Manufacturing Flow
            <div className="flex gap-1 shrink-0">
              <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
              <span className="w-1 h-1 rounded-full bg-primary animate-pulse [animation-delay:200ms]" />
              <span className="w-1 h-1 rounded-full bg-primary animate-pulse [animation-delay:400ms]" />
            </div>
          </h2>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
            Real-time unit progression and stage efficiency across 7 stages
          </p>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 bg-muted/30 px-3 py-1.5 rounded-full border border-border/50 shrink-0">
          {(['done', 'partial', 'pending', 'rejected'] as const).map((s) => {
            const cfg = STATUS_MAP[s];
            return (
              <span
                key={s}
                className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80"
              >
                <div
                  className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    cfg.progressBar.split(' ')[0],
                  )}
                />
                {cfg.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Stage Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 sm:gap-4 relative z-10">
        {PIPELINE_STATS.map((stage, idx) => {
          const cfg = STATUS_MAP[stage.status as keyof typeof STATUS_MAP];
          const Icon = cfg.icon;
          const inputBase = Math.max(stage.input, stage.output, 1);
          const progressPct =
            stage.status === 'pending'
              ? 0
              : Math.min(100, Math.round((stage.output / inputBase) * 100));

          const isLast = idx === PIPELINE_STATS.length - 1;

          return (
            <div key={stage.stageId} className="relative group">
              {/* Connection Line (Desktop) */}
              {!isLast && (
                <div className="hidden xl:flex absolute top-12 left-[calc(100%-8px)] w-full items-center z-0 pointer-events-none opacity-20">
                  <div className="h-0.5 w-full bg-border relative">
                    {stage.status === 'done' && (
                      <div className="absolute inset-0 bg-emerald-500/50 animate-[flow_2s_linear_infinite]" />
                    )}
                    {stage.status === 'partial' && (
                      <div className="absolute inset-0 bg-amber-500/50 animate-[flow_3s_linear_infinite]" />
                    )}
                  </div>
                  <ArrowRight className="w-3 h-3 text-border -ml-1.5" />
                </div>
              )}

              <div
                className={cn(
                  'relative rounded-xl sm:rounded-2xl border p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 transition-all duration-300 hover:scale-[1.02] bg-card/50',
                  cfg.borderClass,
                  stage.status === 'partial' && 'ring-1 ring-amber-500/20',
                )}
              >
                {/* Header: Stage Number & Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-[9px] sm:text-[10px] font-black text-muted-foreground/40 bg-muted/50 w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <Icon
                      className={cn('w-3.5 h-3.5 sm:w-4 sm:h-4', cfg.iconClass)}
                    />
                  </div>
                  {stage.rejections > 0 && (
                    <Badge
                      variant="outline"
                      className="h-4 sm:h-5 px-1 sm:px-1.5 bg-rose-50 border-rose-100 text-rose-600 text-[8px] sm:text-[9px] font-bold font-mono shrink-0"
                    >
                      -{stage.rejections}
                    </Badge>
                  )}
                </div>

                {/* Stage Info */}
                <div>
                  <h3 className="text-[10px] sm:text-xs font-bold text-foreground uppercase tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                    {stage.label}
                  </h3>
                  <div className="mt-2 sm:mt-3 flex items-baseline gap-1">
                    <span
                      className={cn(
                        'text-lg sm:text-2xl font-black tracking-tighter leading-none',
                        stage.status === 'pending'
                          ? 'text-muted-foreground/20'
                          : 'text-foreground',
                      )}
                    >
                      {stage.output > 0
                        ? stage.output.toLocaleString('en-IN')
                        : '0'}
                    </span>
                    <span className="text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                      units
                    </span>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[8px] sm:text-[9px] font-bold text-muted-foreground uppercase opacity-70">
                    <span>Efficiency</span>
                    <span
                      className={cn(
                        stage.status !== 'pending' && 'text-foreground',
                      )}
                    >
                      {progressPct}%
                    </span>
                  </div>
                  <div className="h-1 sm:h-1.5 bg-muted rounded-full overflow-hidden relative">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-1000 ease-out',
                        cfg.progressBar,
                      )}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Bottleneck Warning */}
                {stage.status === 'partial' &&
                  stage.input > stage.output * 1.5 && (
                    <div className="absolute -top-1 -right-1">
                      <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-rose-500"></span>
                      </span>
                    </div>
                  )}
              </div>
            </div>
          );
        })}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes flow {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }
      `,
        }}
      />
    </div>
  );
}
