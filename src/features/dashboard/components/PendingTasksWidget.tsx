import { Clock, Factory } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PENDING_BRANDS } from '@/features/dashboard/data/mock-dashboard';

export function PendingTasksWidget() {
  if (PENDING_BRANDS.length === 0) {
    return (
      <div className="rounded-2xl border bg-card p-5 flex flex-col gap-2 h-full">
        <h2 className="font-semibold text-foreground text-base">
          Pending Brands
        </h2>
        <div className="flex-1 flex flex-col items-center justify-center gap-2 py-8 text-center">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
            <Factory className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-sm text-muted-foreground">
            All brands are currently in production
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-foreground text-base">
            Pending Brands
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Brands with no production logs today
          </p>
        </div>
        <Badge
          variant="secondary"
          className="text-xs border-amber-200 bg-amber-50 text-amber-700"
        >
          {PENDING_BRANDS.length} pending
        </Badge>
      </div>

      <div className="flex flex-col gap-2">
        {PENDING_BRANDS.slice(0, 4).map((brand) => (
          <div
            key={brand.id}
            className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-blue-100 dark:bg-blue-900/30">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-foreground truncate">
                  {brand.name}
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {brand.items.length} items waiting
              </p>
            </div>

            <div className="shrink-0">
              <Badge
                variant="outline"
                className="text-[10px] text-muted-foreground"
              >
                Awaiting Input
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
