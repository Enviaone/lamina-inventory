import { ArrowUpRight, FlameIcon, Truck, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RECENT_ACTIVITY } from '@/features/dashboard/data/mock-dashboard';

const TYPE_CONFIG = {
  production: {
    icon: FlameIcon,
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    label: 'Production',
  },
  rejection: {
    icon: XCircle,
    bg: 'bg-rose-100',
    text: 'text-rose-600',
    label: 'Rejection',
  },
  transfer: {
    icon: Truck,
    bg: 'bg-violet-100',
    text: 'text-violet-600',
    label: 'Transfer',
  },
};

export function RecentActivity() {
  return (
    <div className="rounded-2xl border bg-card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-foreground text-base">
            Recent Activity
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Latest entries across all stages
          </p>
        </div>
        <button className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
          View all <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex flex-col divide-y divide-border">
        {RECENT_ACTIVITY.map((entry) => {
          const t = TYPE_CONFIG[entry.type];
          const Icon = t.icon;

          return (
            <div
              key={entry.id}
              className="flex items-start gap-3 py-3 first:pt-0 last:pb-0 group"
            >
              {/* Type icon */}
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                  t.bg,
                )}
              >
                <Icon className={cn('w-4 h-4', t.text)} />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {entry.item}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {entry.brand} · {entry.stage}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={cn('text-sm font-bold', t.text)}>
                      {entry.qty.toLocaleString('en-IN')}
                      <span className="text-xs font-normal text-muted-foreground ml-0.5">
                        pcs
                      </span>
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {entry.timeAgo}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span
                    className={cn(
                      'text-[10px] font-medium px-1.5 py-0.5 rounded-full',
                      t.bg,
                      t.text,
                    )}
                  >
                    {t.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    by {entry.user}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
