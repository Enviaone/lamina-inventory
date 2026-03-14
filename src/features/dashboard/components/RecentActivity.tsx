import { ArrowUpRight, FlameIcon, Truck, XCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLogStore } from '@/store/log-store';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { NavLink } from 'react-router-dom';

const TYPE_CONFIG = {
  production: {
    icon: FlameIcon,
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-600 dark:text-emerald-400',
    label: 'Production',
  },
  rejection: {
    icon: XCircle,
    bg: 'bg-rose-100 dark:bg-rose-900/30',
    text: 'text-rose-600 dark:text-rose-400',
    label: 'Rejection',
  },
  transfer: {
    icon: Truck,
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-600 dark:text-blue-400',
    label: 'Transfer',
  },
};

export function RecentActivity() {
  const logs = useLogStore((s) => s.logs);

  // Sort by date and take latest 5
  const latestLogs = [...logs]
    .sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="rounded-2xl border bg-card p-5 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-foreground text-base">
            Latest Activity
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time feed from factory floor
          </p>
        </div>
        <NavLink to="/logs">
          <button className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
            View all <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </NavLink>
      </div>

      {latestLogs.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 py-8 text-center opacity-50">
          <Clock className="w-8 h-8 text-muted-foreground/30" />
          <p className="text-xs text-muted-foreground">
            No recent logs recorded
          </p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-border">
          {latestLogs.map((log) => {
            const hasRejection = parseInt(log.data.rejectionQty || '0') > 0;
            const type = hasRejection ? 'rejection' : 'production';
            const t = TYPE_CONFIG[type];
            const Icon = t.icon;

            const qty =
              type === 'rejection'
                ? log.data.rejectionQty
                : log.data.productionQty;

            return (
              <div
                key={log.id}
                className="flex items-start gap-3 py-3 first:pt-0 last:pb-0 group"
              >
                {/* Type icon */}
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-transform group-hover:scale-105',
                    t.bg,
                  )}
                >
                  <Icon className={cn('w-4 h-4', t.text)} />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate uppercase tracking-tight">
                        {log.stageLabel}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 truncate font-medium">
                        {log.brandName} · {log.itemName}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p
                        className={cn('text-xs font-bold leading-none', t.text)}
                      >
                        {qty ? parseInt(qty).toLocaleString('en-IN') : '—'}
                        <span className="text-[10px] font-normal text-muted-foreground ml-0.5">
                          pcs
                        </span>
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {formatDistanceToNow(parseISO(log.submittedAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span
                      className={cn(
                        'text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider',
                        t.bg,
                        t.text,
                      )}
                    >
                      {log.shift}
                    </span>
                    <span className="text-[10px] text-muted-foreground/70 font-medium italic">
                      by {log.userName}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
