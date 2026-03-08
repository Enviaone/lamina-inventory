import { AlertTriangle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { StageConfig } from '@/features/stages/config/stage-config';
import { useLocationsStore } from '@/store/locations-store';
import {
  type FlatStageRow,
  type StageRowState,
  emptyRowState,
} from '@/features/stages/types';

interface StageTableProps {
  config: StageConfig;
  rows: FlatStageRow[];
  searchQuery: string;
  /** Lifted state — managed by StagePage */
  rowState: Record<string, StageRowState>;
  onUpdateField: (
    itemId: string,
    field: keyof StageRowState,
    value: string,
  ) => void;
  /** For Inward Return: which items are selected for receipt */
  selectedItems?: Set<string>;
  onToggleItem?: (itemId: string) => void;
  /** Per-item output from previous stage, for mismatch validation */
  prevStageOutput?: Record<string, number>;
}

export function StageTable({
  config,
  rows,
  searchQuery,
  rowState,
  onUpdateField,
  selectedItems,
  onToggleItem,
  prevStageOutput = {},
}: StageTableProps) {
  const isInwardReturn = config.stageId === 'INWARD_RETURN';
  const locations = useLocationsStore((s) => s.locations);

  const filteredRows = rows.filter(
    (r) =>
      r.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.sku.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getApproved = (state: StageRowState) => {
    const input = parseFloat(state.inputQty) || 0;
    const rejection = parseFloat(state.rejectionQty) || 0;
    return Math.max(0, input - rejection);
  };

  const getMismatch = (
    row: FlatStageRow,
    state: StageRowState,
  ): number | null => {
    if (!config.validatePrevStage) return null;
    const input = parseFloat(state.inputQty);
    if (!input) return null;
    const expected = prevStageOutput[row.itemId] ?? 0;
    if (expected === 0) return null;
    return Math.abs(input - expected) > 0 ? expected : null;
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            {isInwardReturn && (
              <TableHead className="w-10 text-center font-semibold text-foreground">
                Select
              </TableHead>
            )}
            <TableHead className="w-10 text-center font-semibold text-foreground">
              #
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Item
            </TableHead>
            <TableHead className="font-semibold text-foreground">SKU</TableHead>
            {config.columns.map((col) => (
              <TableHead
                key={col.key}
                className="font-semibold text-foreground"
              >
                {col.header}
              </TableHead>
            ))}
            {config.showApproved && (
              <TableHead className="font-semibold text-foreground">
                Approved Qty
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredRows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={
                  (isInwardReturn ? 1 : 0) +
                  3 +
                  config.columns.length +
                  (config.showApproved ? 1 : 0) +
                  1
                }
                className="h-32 text-center text-muted-foreground text-sm"
              >
                No items found.
              </TableCell>
            </TableRow>
          ) : (
            filteredRows.map((row, idx) => {
              const state = rowState[row.itemId] ?? emptyRowState();
              const mismatchExpected = getMismatch(row, state);
              const approved = getApproved(state);
              const isSelected = isInwardReturn
                ? (selectedItems?.has(row.itemId) ?? false)
                : true;
              const isDisabled = isInwardReturn && !isSelected;

              return (
                <TableRow
                  key={row.itemId}
                  className={
                    mismatchExpected != null
                      ? 'bg-amber-50/60'
                      : isDisabled
                        ? 'opacity-40'
                        : undefined
                  }
                >
                  {isInwardReturn && (
                    <TableCell className="text-center">
                      <Checkbox
                        id={`select-${row.itemId}`}
                        checked={isSelected}
                        onCheckedChange={() => onToggleItem?.(row.itemId)}
                      />
                    </TableCell>
                  )}

                  <TableCell className="text-center text-muted-foreground font-medium text-sm">
                    {idx + 1}
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-primary">
                        {row.itemName}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="text-xs text-muted-foreground mt-0.5">
                      {row.sku}
                    </span>
                  </TableCell>

                  {config.columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.key === 'location' ? (
                        <Select
                          value={state.location}
                          onValueChange={(v) =>
                            onUpdateField(row.itemId, 'location', v)
                          }
                          disabled={isDisabled}
                        >
                          <SelectTrigger className="h-9 w-44 text-sm">
                            <SelectValue
                              placeholder={`Select ${config.locationDirection ?? 'location'}`}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {locations.map((loc) => (
                              <SelectItem key={loc.id} value={loc.name}>
                                {loc.name}
                                {loc.isDefault ? ' ★' : ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="flex flex-col gap-0.5">
                          <Input
                            type="number"
                            min={0}
                            placeholder={col.placeholder}
                            value={state[col.key as keyof StageRowState]}
                            onChange={(e) =>
                              onUpdateField(
                                row.itemId,
                                col.key as keyof StageRowState,
                                e.target.value,
                              )
                            }
                            className="h-9 w-36 text-sm"
                            disabled={isDisabled}
                          />
                        </div>
                      )}

                      {col.key === 'inputQty' && mismatchExpected != null && (
                        <div className="flex items-center gap-1 mt-1 text-amber-600">
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          <span className="text-[10px]">
                            Expected {mismatchExpected.toLocaleString('en-IN')}{' '}
                            pcs from prev. stage
                          </span>
                        </div>
                      )}
                    </TableCell>
                  ))}

                  {config.showApproved && (
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <Badge
                          variant={approved > 0 ? 'secondary' : 'outline'}
                          className="w-fit text-sm font-semibold"
                        >
                          {approved > 0 ? approved : '—'}
                        </Badge>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </>
  );
}
