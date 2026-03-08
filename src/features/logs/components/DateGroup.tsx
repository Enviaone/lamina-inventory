import { Badge } from '@/components/ui/badge';
import type { LogEntry } from '@/store/log-store';
import { LogCard } from '@/features/logs/components/LogCard';

export interface DateGroupProps {
  label: string;
  entries: LogEntry[];
  isAdmin: boolean;
  onEdit: (entry: LogEntry) => void;
  onDelete: (entry: LogEntry) => void;
}

export function DateGroup({
  label,
  entries,
  isAdmin,
  onEdit,
  onDelete,
}: DateGroupProps) {
  return (
    <div>
      {/* Date header */}
      <div className="flex items-center gap-3 mb-2 px-1">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
        <div className="flex-1 h-px bg-border" />
        <Badge variant="outline" className="text-[10px] h-5 px-2">
          {entries.length} entr{entries.length === 1 ? 'y' : 'ies'}
        </Badge>
      </div>

      {/* Cards */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {entries.map((e) => (
          <LogCard
            key={e.id}
            entry={e}
            isAdmin={isAdmin}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
