import { useState } from 'react';
import { Package2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  const [shift, setShift] = useState(entry?.shift ?? 'S1');
  const [inputQty, setInputQty] = useState(entry?.data.inputQty ?? '');
  const [productionQty, setProdQty] = useState(entry?.data.productionQty ?? '');
  const [rejectionQty, setRejectionQty] = useState(
    entry?.data.rejectionQty ?? '',
  );

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
    if (!entry) return;
    onSave(entry.id, shift, {
      ...entry.data,
      inputQty,
      productionQty,
      rejectionQty,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={!!entry} onOpenChange={handleOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Log Entry</DialogTitle>
        </DialogHeader>

        {entry && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border">
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
        )}

        <div className="space-y-3 py-1">
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

          {entry?.data.inputQty !== '' && (
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

          {entry?.data.productionQty !== '' && (
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

          {entry?.data.rejectionQty !== '' && (
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

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
