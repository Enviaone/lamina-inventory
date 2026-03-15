import { TrendingDown, AlertCircle } from 'lucide-react';
import { useLogStore } from '@/store/log-store';
import { EmptyState } from '@/components/ui/empty';

export function TodaysRejection() {
  const { logs } = useLogStore();

  // Aggregate stats per stage
  const stageStats = logs.reduce(
    (acc, log) => {
      const stage = log.stageLabel;
      if (!acc[stage]) {
        acc[stage] = {
          name: stage,
          rejections: 0,
          totalOutput: 0,
        };
      }
      acc[stage].rejections += parseInt(log.data.rejectionQty || '0') || 0;
      acc[stage].totalOutput += parseInt(log.data.productionQty || '0') || 0;
      return acc;
    },
    {} as Record<
      string,
      {
        name: string;
        rejections: number;
        totalOutput: number;
      }
    >,
  );

  const statsList = Object.values(stageStats)
    .filter((s) => s.rejections > 0)
    .sort((a, b) => b.rejections - a.rejections)
    .slice(0, 5);

  const totalRejections = statsList.reduce((acc, s) => acc + s.rejections, 0);
  const maxRejections = Math.max(...statsList.map((s) => s.rejections), 1);

  return (
    <div className="rounded-2xl border bg-card p-5 flex flex-col gap-4 h-full transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div>
            <h2 className="font-semibold text-foreground text-base">
              Today's Rejections
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Unit flagging by stage
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 pt-1">
        {statsList.map((stage) => {
          const sharePct = (stage.rejections / (totalRejections || 1)) * 100;
          const barWidth = (stage.rejections / maxRejections) * 100;
          const rejectionRate =
            stage.totalOutput > 0
              ? (
                  (stage.rejections / (stage.totalOutput + stage.rejections)) *
                  100
                ).toFixed(1)
              : '0.0';

          return (
            <div key={stage.name} className="space-y-2 group">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate transition-colors pr-2">
                    {stage.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-rose-600 font-bold bg-rose-50 dark:bg-rose-900/30 px-1.5 py-0.5 rounded">
                      {stage.rejections.toLocaleString()} units
                    </span>
                    <span className="text-[8px] text-muted-foreground/30">
                      •
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {rejectionRate}% Reject Rate
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-foreground">
                    {Math.round(sharePct)}%
                  </p>
                  <p className="text-[9px] text-muted-foreground font-medium">
                    share
                  </p>
                </div>
              </div>

              <div className="relative h-1 w-full bg-muted/50 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-rose-500/10 rounded-full w-full"
                  style={{ width: '100%' }}
                />
                <div
                  className="absolute inset-y-0 left-0 bg-rose-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(244,63,94,0.4)]"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}

        {statsList.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 gap-2 opacity-40">
            <EmptyState
              title="No Rejections"
              description="No rejections reported today"
              icons={[AlertCircle]}
            />
          </div>
        )}
      </div>

      {statsList.length > 0 && (
        <div className="mt-auto pt-4 border-t border-dashed border-border/50">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground font-medium flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
              Total Rejections
            </span>
            <span className="text-foreground font-bold">
              {totalRejections.toLocaleString()} units
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
