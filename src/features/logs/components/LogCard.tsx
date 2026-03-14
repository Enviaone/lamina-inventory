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
  const { value } = primaryQty(entry);
  const showInput =
    entry.data.inputQty !== undefined && entry.data.inputQty !== '';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center px-4 sm:px-5 py-4 sm:py-3.5 border-b border-border last:border-0 hover:bg-muted/10 transition-colors group gap-4 sm:gap-0">
      {/* ── Section 1: Item & Brand ── */}
      <div className="w-full sm:w-[30%] min-w-0">
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-muted border border-border">
              <Package2 className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-primary leading-none truncate">
                {entry.brandName}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="text-[11px] font-medium text-muted-foreground truncate">
                  {entry.itemName}
                </span>
                <Badge
                  variant="secondary"
                  className="text-[9px] h-4 px-1 rounded-sm bg-muted text-muted-foreground font-bold shadow-none border-none"
                >
                  {entry.shift}
                </Badge>
              </div>
            </div>
          </div>

          {/* Mobile Actions */}
          {isAdmin && (
            <div className="flex items-center gap-0.5 sm:hidden shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground"
                onClick={() => onEdit(entry)}
              >
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(entry)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile Metrics Grid (Visible only on mobile) ── */}
      <div className="grid grid-cols-3 gap-2 sm:hidden bg-muted/40 p-3 rounded-xl border border-border/50">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
            Stage
          </span>
          <span className="text-xs font-semibold text-foreground uppercase truncate">
            {entry.stageLabel}
          </span>
        </div>
        <div className="flex flex-col gap-1 border-l border-border/50 pl-3">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
            Input
          </span>
          <span className="text-xs font-semibold text-foreground">
            {entry.data.inputQty || '—'}
          </span>
        </div>
        <div className="flex flex-col gap-1 border-l border-border/50 pl-3">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
            Produced
          </span>
          <span className="text-xs font-semibold text-foreground">{value}</span>
        </div>
      </div>

      {/* ── Desktop/Tablet Sections (Hidden/Visible by breakpoints) ── */}

      {/* Stage */}
      <div className="hidden sm:block w-[15%]">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight bg-muted/60 px-2 py-0.5 rounded-md border border-border/50">
          {entry.stageLabel}
        </span>
      </div>

      {/* Inputs */}
      <div className="hidden md:block w-[15%]">
        <div className="flex flex-col">
          {showInput ? (
            <>
              <span className="text-sm font-semibold text-foreground leading-none">
                {entry.data.inputQty}
              </span>
              <span className="text-[9px] text-muted-foreground uppercase tracking-widest mt-1">
                Units
              </span>
            </>
          ) : (
            <span className="text-muted-foreground/20">—</span>
          )}
        </div>
      </div>

      {/* Produced */}
      <div className="hidden sm:block w-[15%]">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground leading-none">
            {value}
          </span>
          <span className="text-[9px] text-muted-foreground uppercase tracking-widest mt-1">
            Units
          </span>
        </div>
      </div>

      {/* Updated By */}
      <div className="w-full sm:w-[15%] flex sm:block items-center justify-between border-t border-border/50 sm:border-0 pt-3 sm:pt-0">
        <div className="sm:hidden text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          Updated By
        </div>
        <div className="text-right sm:text-left">
          <p className="text-sm font-semibold text-foreground leading-tight">
            {entry.userName}
          </p>
          <p className="text-[11px] font-medium text-muted-foreground mt-0.5 whitespace-nowrap">
            {format(parseISO(entry.submittedAt), 'MMM dd, yyyy')}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex-1 hidden sm:flex items-center justify-end gap-1">
        {isAdmin && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground sm:opacity-40 sm:group-hover:opacity-100 transition-opacity"
              onClick={() => onEdit(entry)}
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive sm:opacity-40 sm:group-hover:opacity-100 transition-opacity"
              onClick={() => onDelete(entry)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
