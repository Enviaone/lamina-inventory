import { format, parseISO } from 'date-fns';
import { Package2, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { LogEntry } from '@/store/log-store';
import { primaryQty } from '@/features/logs/utils/log-utils';

export interface LogCardProps {
  entry: LogEntry;
  isAdmin: boolean;
  onEdit: (entry: LogEntry) => void;
  onDelete: (entry: LogEntry) => void;
}

export function LogCard({ entry, isAdmin, onEdit, onDelete }: LogCardProps) {
  const { value, label, sub } = primaryQty(entry);

  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-0 hover:bg-muted/20 transition-colors group">
      {/* Left — icon + brand + item details */}
      <div className="flex items-center gap-3 min-w-0 flex-2">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Package2 className="w-5 h-5 text-primary" />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {entry.brandName}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5 flex-wrap">
            <span>{entry.stageLabel}</span>
            <span className="text-border">·</span>
            <span className="font-medium text-foreground/70">
              {entry.itemName}
            </span>
            <Badge
              variant="outline"
              className="text-[10px] h-5 px-1.5 shrink-0"
            >
              {entry.shift}
            </Badge>
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden sm:block h-10 w-px bg-border shrink-0" />

      {/* Center — primary qty */}
      <div className="hidden sm:flex flex-col items-center text-center flex-1 shrink-0">
        <span className="text-xl font-bold text-foreground leading-none">
          {value}
        </span>
        <span className="text-xs text-muted-foreground mt-1">{label}</span>
        {sub && (
          <span className="text-[11px] text-muted-foreground/70">{sub}</span>
        )}
        {/* {entry.data.location && (
          <span className="text-[11px] text-muted-foreground/70 mt-0.5">
            → {entry.data.location}
          </span>
        )} */}
      </div>

      {/* Divider */}
      <div className="hidden sm:block h-10 w-px bg-border shrink-0" />

      {/* Right — user + date + shift + actions */}
      <div className="flex items-center gap-3 shrink-0 flex-1 justify-end">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-foreground">
            {entry.userName}
          </p>
          <p className="text-xs text-muted-foreground">
            {format(parseISO(entry.submittedAt), 'MMM dd, yyyy')}
          </p>
        </div>

        {entry.editedAt && (
          <Badge
            variant="outline"
            className="text-[10px] h-5 px-1.5 text-amber-500 border-amber-400 shrink-0"
          >
            edited
          </Badge>
        )}

        {isAdmin && (
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              title="Edit entry"
              onClick={() => onEdit(entry)}
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              title="Delete entry"
              onClick={() => onDelete(entry)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
