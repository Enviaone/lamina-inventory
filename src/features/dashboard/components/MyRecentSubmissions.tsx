import { History, Clock } from 'lucide-react';
import { useLogStore } from '@/store/log-store';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { EmptyState } from '@/components/ui/empty';

interface MyRecentSubmissionsProps {
  userId: string;
}

export function MyRecentSubmissions({ userId }: MyRecentSubmissionsProps) {
  const logs = useLogStore((s) => s.logs);

  // Filter logs for this operator and sort by date
  const myLogs = logs
    .filter((log) => log.userId === userId)
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
            My Recent Entries
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your last 5 recorded submissions
          </p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
          <History className="w-4.5 h-4.5 text-primary" />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {myLogs.length === 0 ? (
          <div className="py-8">
            <EmptyState
              title="No entries yet"
              description="Your recent submissions will appear here"
              icons={[Clock]}
            />
          </div>
        ) : (
          myLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border transition-all group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground truncate">
                    {log.brandName}
                  </p>
                  <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap">
                    {formatDistanceToNow(parseISO(log.submittedAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-muted-foreground truncate">
                    {log.itemName}
                  </span>
                  <span className="text-[8px] text-muted-foreground/50">•</span>
                  <span className="text-[11px] font-medium text-primary">
                    {parseInt(log.data.productionQty || '0').toLocaleString()}{' '}
                    units
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
