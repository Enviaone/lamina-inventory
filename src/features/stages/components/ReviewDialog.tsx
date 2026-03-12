import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';
import { ResponsiveDialog } from '@/components/shared/ResponsiveDialog';
import type { StageConfig } from '@/features/stages/config/stage-config';
import type { FlatStageRow, StageRowState } from '@/features/stages/types';

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: StageConfig;
  brandName: string;
  rows: FlatStageRow[];
  rowState: Record<string, StageRowState>;
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
  onConfirm,
  isSubmitting,
}: ReviewDialogProps) {
  // Only include rows that have quantitative data filled
  const filledRows = rows.filter((row) => {
    const s = rowState[row.itemId];
    return s && (s.inputQty || s.productionQty || s.rejectionQty);
  });

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Review & Record — ${config.label}`}
      description={`Confirm entries for ${brandName} before saving. Only filled rows are shown.`}
      desktopClassName="max-w-2xl max-h-[85vh] flex flex-col gap-0 overflow-hidden"
    >
      <ReviewDialogContent
        config={config}
        filledRows={filledRows}
        rowState={rowState}
        onConfirm={onConfirm}
        isSubmitting={isSubmitting}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
}

function ReviewDialogContent({
  config,
  filledRows,
  rowState,
  onConfirm,
  isSubmitting,
  onCancel,
}: {
  config: StageConfig;
  filledRows: FlatStageRow[];
  rowState: Record<string, StageRowState>;
  onConfirm: () => void;
  isSubmitting: boolean;
  onCancel: () => void;
}) {
  const hasData = filledRows.length > 0;

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

  return (
    <>
      <div className="overflow-y-auto w-full py-4 -mx-1 px-1">
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
                      <span
                        key={row.itemId}
                        className="inline-block px-2 py-1 bg-muted rounded text-xs font-medium truncate max-w-30 sm:max-w-50"
                        title={row.itemName}
                      >
                        {row.itemName}
                      </span>
                    </td>
                    {config.columns.map((col) => (
                      <td key={col.key} className="py-2.5 pr-4">
                        {col.key === 'location' ? (
                          <Badge
                            variant="outline"
                            className="text-[10px] sm:text-xs font-normal"
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

      <div className="pt-4 mt-auto border-t border-border flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2">
        <Button
          type="button"
          variant="outline"
          className="mt-2 sm:mt-0"
          onClick={onCancel}
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
      </div>
    </>
  );
}
