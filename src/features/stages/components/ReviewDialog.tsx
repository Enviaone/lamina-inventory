import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ClipboardCheck } from 'lucide-react';
import type { StageConfig } from '@/features/stages/config/stage-config';
import type { FlatStageRow, StageRowState } from '@/features/stages/types';

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: StageConfig;
  brandName: string;
  rows: FlatStageRow[];
  rowState: Record<string, StageRowState>;
  selectedItems?: Set<string>;
  onConfirm: () => void;
  isSubmitting: boolean;
}

function getApproved(state: StageRowState): number {
  const input = parseFloat(state.inputQty) || 0;
  const rejection = parseFloat(state.rejectionQty) || 0;
  return Math.max(0, input - rejection);
}

export function ReviewDialog({
  open,
  onOpenChange,
  config,
  brandName,
  rows,
  rowState,
  selectedItems,
  onConfirm,
  isSubmitting,
}: ReviewDialogProps) {
  // Only include rows that have any data filled (and are selected for Inward Return)
  const filledRows = rows.filter((row) => {
    if (selectedItems && !selectedItems.has(row.itemId)) return false;
    const s = rowState[row.itemId];
    return s && (s.inputQty || s.productionQty || s.rejectionQty || s.location);
  });

  // Compute totals
  const totals = filledRows.reduce(
    (acc, row) => {
      const s = rowState[row.itemId];
      acc.input += parseFloat(s?.inputQty || '0') || 0;
      acc.production += parseFloat(s?.productionQty || '0') || 0;
      acc.rejection += parseFloat(s?.rejectionQty || '0') || 0;
      if (config.showApproved) acc.approved += getApproved(s);
      return acc;
    },
    { input: 0, production: 0, rejection: 0, approved: 0 },
  );

  const hasData = filledRows.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="flex items-center gap-2 text-base">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            Review &amp; Record — {config.label}
          </DialogTitle>
          <DialogDescription className="text-sm mt-1">
            Confirm entries for{' '}
            <span className="font-medium text-foreground">{brandName}</span>{' '}
            before saving. Only filled rows are shown.
          </DialogDescription>
        </DialogHeader>

        {/* Summary table */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          {!hasData ? (
            <div className="text-center py-10 text-muted-foreground text-sm">
              No data entered yet. Fill in at least one row to record.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-2 pr-4 font-semibold text-foreground text-xs">
                    Item
                  </th>
                  {config.columns.map((col) => (
                    <th
                      key={col.key}
                      className="pb-2 pr-4 font-semibold text-foreground text-xs"
                    >
                      {col.header}
                    </th>
                  ))}
                  {config.showApproved && (
                    <th className="pb-2 font-semibold text-foreground text-xs">
                      Approved
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filledRows.map((row) => {
                  const s = rowState[row.itemId];
                  const approved = getApproved(s);
                  return (
                    <tr
                      key={row.itemId}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-2.5 pr-4">
                        <p className="font-medium text-foreground leading-tight">
                          {row.itemName}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {row.sku}
                        </p>
                      </td>
                      {config.columns.map((col) => (
                        <td key={col.key} className="py-2.5 pr-4">
                          {col.key === 'location' ? (
                            <Badge
                              variant="outline"
                              className="text-xs font-normal"
                            >
                              {s?.location || '—'}
                            </Badge>
                          ) : (
                            <span className="font-semibold text-foreground">
                              {parseFloat(
                                s?.[col.key as keyof StageRowState] || '0',
                              ) || 0}
                            </span>
                          )}
                          {col.key !== 'location' && (
                            <span className="text-[10px] text-muted-foreground ml-1">
                              pcs
                            </span>
                          )}
                        </td>
                      ))}
                      {config.showApproved && (
                        <td className="py-2.5">
                          <span className="font-semibold text-green-600">
                            {approved}
                          </span>
                          <span className="text-[10px] text-muted-foreground ml-1">
                            pcs
                          </span>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>

              {/* Totals row */}
              <tfoot>
                <tr className="border-t-2 border-border bg-muted/40">
                  <td className="py-2.5 pr-4 font-bold text-xs text-foreground">
                    Total ({filledRows.length} item
                    {filledRows.length !== 1 ? 's' : ''})
                  </td>
                  {config.columns.map((col) => (
                    <td key={col.key} className="py-2.5 pr-4">
                      {col.key !== 'location' && (
                        <span className="font-bold text-foreground">
                          {col.key === 'inputQty'
                            ? totals.input
                            : col.key === 'productionQty'
                              ? totals.production
                              : col.key === 'rejectionQty'
                                ? totals.rejection
                                : 0}
                          <span className="text-[10px] font-normal text-muted-foreground ml-1">
                            pcs
                          </span>
                        </span>
                      )}
                    </td>
                  ))}
                  {config.showApproved && (
                    <td className="py-2.5">
                      <span className="font-bold text-green-600">
                        {totals.approved}
                      </span>
                      <span className="text-[10px] font-normal text-muted-foreground ml-1">
                        pcs
                      </span>
                    </td>
                  )}
                </tr>
              </tfoot>
            </table>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Back to Edit
          </Button>
          <Button
            onClick={onConfirm}
            disabled={!hasData || isSubmitting}
            className="gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            {isSubmitting ? 'Saving…' : 'Confirm & Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
