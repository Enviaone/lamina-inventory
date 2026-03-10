import { AlertTriangle } from 'lucide-react';
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
  /** Per-item output from previous stage, for mismatch validation */
  prevStageOutput?: Record<string, number>;
}

export function StageTable({
  config,
  rows,
  searchQuery,
  rowState,
  onUpdateField,
  prevStageOutput = {},
}: StageTableProps) {
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
      {/* Mobile Card Layout */}
      <div className="block lg:hidden bg-card">
        {filteredRows.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No items found.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredRows.map((row, idx) => {
              const state = rowState[row.itemId] ?? emptyRowState();
              const mismatchExpected = getMismatch(row, state);
              const approved = getApproved(state);

              return (
                <div
                  key={row.itemId}
                  className={`p-4 flex flex-col gap-3 ${
                    mismatchExpected != null ? 'bg-amber-50/60' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-muted-foreground">
                            #{idx + 1}
                          </span>
                          <span className="font-medium text-primary text-sm leading-tight">
                            {row.itemName}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {row.sku}
                        </p>
                      </div>
                    </div>
                    {config.showApproved && (
                      <Badge
                        variant={approved > 0 ? 'secondary' : 'outline'}
                        className="text-xs shrink-0"
                      >
                        {approved > 0 ? `${approved} Appr.` : '—'}
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-1 sm:grid-cols-4">
                    {config.columns.map((col) => (
                      <div key={col.key} className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                          {col.header}
                        </label>
                        {col.key === 'location' ? (
                          <Select
                            value={state.location}
                            onValueChange={(v) =>
                              onUpdateField(row.itemId, 'location', v)
                            }
                          >
                            <SelectTrigger className="h-9 w-full text-sm">
                              <SelectValue
                                placeholder={
                                  config.locationDirection ?? 'Location'
                                }
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
                              placeholder={col.placeholder ?? '—'}
                              value={state[col.key as keyof StageRowState]}
                              onChange={(e) =>
                                onUpdateField(
                                  row.itemId,
                                  col.key as keyof StageRowState,
                                  e.target.value,
                                )
                              }
                              className="h-9 w-full text-sm"
                            />
                            {col.key === 'inputQty' &&
                              mismatchExpected != null && (
                                <div className="flex items-start gap-1 mt-1 text-amber-600">
                                  <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                                  <span className="text-[10px] leading-tight flex-1">
                                    Exp.{' '}
                                    {mismatchExpected.toLocaleString('en-IN')}{' '}
                                    pcs
                                  </span>
                                </div>
                              )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden lg:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-10 text-center font-semibold text-foreground">
                #
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Item
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                SKU
              </TableHead>
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

                return (
                  <TableRow
                    key={row.itemId}
                    className={
                      mismatchExpected != null ? 'bg-amber-50/60' : undefined
                    }
                  >
                    <TableCell className="text-center text-muted-foreground font-medium text-sm">
                      {idx + 1}
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-primary whitespace-nowrap">
                          {row.itemName}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs text-muted-foreground mt-0.5 whitespace-nowrap">
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
                          >
                            <SelectTrigger className="h-9 w-40 sm:w-44 text-sm">
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
                              className="h-9 w-28 sm:w-36 text-sm"
                            />
                          </div>
                        )}

                        {col.key === 'inputQty' && mismatchExpected != null && (
                          <div className="flex items-center gap-1 mt-1 text-amber-600">
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            <span className="text-[10px]">
                              Expected{' '}
                              {mismatchExpected.toLocaleString('en-IN')} pcs
                              from prev. stage
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
      </div>
    </>
  );
}
