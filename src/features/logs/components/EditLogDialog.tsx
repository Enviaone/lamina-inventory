import { useState } from 'react';
import { Package2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ResponsiveDialog } from '@/components/shared/ResponsiveDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { LogEntry } from '@/store/log-store';

export interface EditLogDialogProps {
  entry: LogEntry | null;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, shift: string, data: LogEntry['data']) => void;
}

export function EditLogDialog({
  entry,
  onOpenChange,
  onSave,
}: EditLogDialogProps) {
  const [prevEntry, setPrevEntry] = useState(entry);
  const [shift, setShift] = useState(entry?.shift ?? 'S1');
  const [inputQty, setInputQty] = useState<string>(entry?.data.inputQty ?? '');
  const [productionQty, setProdQty] = useState<string>(
    entry?.data.productionQty ?? '',
  );
  const [rejectionQty, setRejectionQty] = useState<string>(
    entry?.data.rejectionQty ?? '',
  );

  if (entry && entry !== prevEntry) {
    setPrevEntry(entry);
    setShift(entry.shift);
    setInputQty(entry.data.inputQty);
    setProdQty(entry.data.productionQty);
    setRejectionQty(entry.data.rejectionQty);
  }

  const handleOpen = (v: boolean) => {
    if (v && entry) {
      setShift(entry.shift);
      setInputQty(entry.data.inputQty);
      setProdQty(entry.data.productionQty);
      setRejectionQty(entry.data.rejectionQty);
    }
    onOpenChange(v);
  };

  const handleSave = () => {
    const targetEntry = entry || prevEntry;
    if (!targetEntry) return;

    onSave(targetEntry.id, shift, {
      ...targetEntry.data,
      inputQty: String(inputQty),
      productionQty: String(productionQty),
      rejectionQty: String(rejectionQty),
    });
    onOpenChange(false);
  };

  const currentEntry = entry || prevEntry;

  return (
    <ResponsiveDialog
      open={!!entry}
      onOpenChange={handleOpen}
      title="Edit Log Entry"
    >
      {currentEntry ? (
        <EditLogInputs
          entry={currentEntry}
          shift={shift}
          setShift={setShift}
          inputQty={inputQty}
          setInputQty={setInputQty}
          productionQty={productionQty}
          setProdQty={setProdQty}
          rejectionQty={rejectionQty}
          setRejectionQty={setRejectionQty}
          onSave={handleSave}
          onCancel={() => onOpenChange(false)}
        />
      ) : null}
    </ResponsiveDialog>
  );
}

function EditLogInputs({
  entry,
  shift,
  setShift,
  inputQty,
  setInputQty,
  productionQty,
  setProdQty,
  rejectionQty,
  setRejectionQty,
  onSave,
  onCancel,
}: {
  entry: LogEntry;
  shift: string;
  setShift: (v: string) => void;
  inputQty: string;
  setInputQty: (v: string) => void;
  productionQty: string;
  setProdQty: (v: string) => void;
  rejectionQty: string;
  setRejectionQty: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <>
      <div className="mt-2 flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Package2 className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            {entry.itemName}
          </p>
          <p className="text-xs text-muted-foreground">
            {entry.brandName} · {entry.stageLabel}
          </p>
        </div>
      </div>

      <div className="space-y-3 py-4">
        <div className="flex flex-col gap-1.5">
          <Label>Shift</Label>
          <Select value={shift} onValueChange={setShift}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['S1', 'S2', 'S3', 'S4'].map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {entry.data.inputQty !== '' && (
          <div className="flex flex-col gap-1.5">
            <Label>Input Qty</Label>
            <Input
              type="number"
              min={0}
              value={inputQty}
              onChange={(e) => setInputQty(e.target.value)}
              placeholder="—"
            />
          </div>
        )}

        {entry.data.productionQty !== '' && (
          <div className="flex flex-col gap-1.5">
            <Label>Production Qty</Label>
            <Input
              type="number"
              min={0}
              value={productionQty}
              onChange={(e) => setProdQty(e.target.value)}
              placeholder="—"
            />
          </div>
        )}

        {entry.data.rejectionQty !== '' && (
          <div className="flex flex-col gap-1.5">
            <Label>Rejection Qty</Label>
            <Input
              type="number"
              min={0}
              value={rejectionQty}
              onChange={(e) => setRejectionQty(e.target.value)}
              placeholder="—"
            />
          </div>
        )}
      </div>

      <div className="pt-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2">
        <Button
          type="button"
          variant="outline"
          className="mt-2 sm:mt-0"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button onClick={onSave}>Save Changes</Button>
      </div>
    </>
  );
}
