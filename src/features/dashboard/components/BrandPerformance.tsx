import { TrendingUp } from 'lucide-react';
import { useLogStore } from '@/store/log-store';
import { cn } from '@/lib/utils';

export function BrandPerformance() {
  const { logs } = useLogStore();

  // Aggregate stats per brand
  const brandStats = logs.reduce(
    (acc, log) => {
      const brand = log.brandName;
      if (!acc[brand]) {
        acc[brand] = {
          name: brand,
          totalOutput: 0,
          totalInput: 0,
          rejections: 0,
        };
      }
      acc[brand].totalOutput += parseInt(log.data.productionQty || '0') || 0;
      acc[brand].totalInput += parseInt(log.data.inputQty || '0') || 0;
      acc[brand].rejections += parseInt(log.data.rejectionQty || '0') || 0;
      return acc;
    },
    {} as Record<
      string,
      {
        name: string;
        totalOutput: number;
        totalInput: number;
        rejections: number;
      }
    >,
  );

  const statsList = Object.values(brandStats)
    .sort((a, b) => b.totalOutput - a.totalOutput)
    .slice(0, 5);

  const maxOutput = Math.max(...statsList.map((s) => s.totalOutput), 1);
  const totalFactoryOutput = statsList.reduce(
    (acc, s) => acc + s.totalOutput,
    0,
  );

  return (
    <div className="rounded-2xl border bg-card p-5 flex flex-col gap-4 h-full shadow-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div>
            <h2 className="font-semibold text-foreground text-base">
              Brand Performance
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Production distribution by client
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 pt-1">
        {statsList.map((brand) => {
          const yieldRate =
            brand.totalInput > 0
              ? Math.round((brand.totalOutput / brand.totalInput) * 100)
              : 100;
          const sharePct =
            (brand.totalOutput / (totalFactoryOutput || 1)) * 100;
          const barWidth = (brand.totalOutput / maxOutput) * 100;

          return (
            <div key={brand.name} className="space-y-2 group">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors pr-2">
                    {brand.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {brand.totalOutput.toLocaleString()} units
                    </span>
                    <span className="text-[8px] text-muted-foreground/30">
                      •
                    </span>
                    <span
                      className={cn(
                        'text-[10px] font-bold',
                        yieldRate > 90 ? 'text-emerald-600' : 'text-amber-600',
                      )}
                    >
                      {yieldRate}% Yield
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-foreground">
                    {Math.round(sharePct)}%
                  </p>
                </div>
              </div>

              <div className="relative h-1 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-primary/20 rounded-full w-full"
                  style={{ width: '100%' }}
                />
                <div
                  className="absolute inset-y-0 left-0 bg-primary/80 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}

        {statsList.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 gap-2 opacity-30">
            <TrendingUp className="w-8 h-8 text-muted-foreground" />
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              No brand activity today
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
