import { AlertCircle } from 'lucide-react';
import { useLogStore } from '@/store/log-store';
import { EmptyState } from '@/components/ui/empty';

export function TodaysRejection() {
  const { logs } = useLogStore();

  // Aggregate rejections per Brand + Item + Stage
  const aggregated = logs.reduce(
    (acc, log) => {
      const rejs = parseInt(log.data.rejectionQty || '0') || 0;
      if (rejs <= 0) return acc;

      const key = `${log.brandName}-${log.itemName}-${log.stageLabel}`;
      if (!acc[key]) {
        acc[key] = {
          brand: log.brandName,
          item: log.itemName,
          stage: log.stageLabel,
          rejections: 0,
        };
      }
      acc[key].rejections += rejs;
      return acc;
    },
    {} as Record<
      string,
      {
        brand: string;
        item: string;
        stage: string;
        rejections: number;
      }
    >,
  );

  const statsList = Object.values(aggregated)
    .sort((a, b) => b.rejections - a.rejections)
    .slice(0, 5);

  return (
    <div className="rounded-2xl border bg-card p-5 flex flex-col h-full transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div>
            <h2 className="font-semibold text-foreground text-base">
              Today's Rejections
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Rejection items
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {statsList.map((entry, idx) => (
          <div
            key={`${entry.brand}-${entry.item}-${idx}`}
            className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border transition-all group"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-foreground truncate">
                  {entry.brand}
                </p>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-sm font-semibold text-rose-600 tabular-nums">
                    {entry.rejections}
                  </span>
                  <span className="text-[10px] text-muted-foreground/70 font-medium">
                    units
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] text-muted-foreground truncate">
                  {entry.item}
                </span>
                <span className="text-[8px] text-muted-foreground/30">•</span>
                <span className="text-[11px] font-medium text-muted-foreground/60 capitalize">
                  {entry.stage.toLowerCase()}
                </span>
              </div>
            </div>
          </div>
        ))}

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
    </div>
  );
}
