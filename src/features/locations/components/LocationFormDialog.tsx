import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Location } from '@/store/locations-store';

export interface LocationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Location;
  onSave: (name: string) => void;
}

export function LocationFormDialog({
  open,
  onOpenChange,
  initial,
  onSave,
}: LocationFormDialogProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const isEdit = !!initial;

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name);
    onOpenChange(false);
    setName('');
  };

  const handleOpenChange = (v: boolean) => {
    if (v) setName(initial?.name ?? '');
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Location' : 'Add Location'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update location details below.'
              : 'Enter the details for the new location.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="loc-name">Name</Label>
            <Input
              id="loc-name"
              placeholder="e.g. Chennai Warehouse"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            {isEdit ? 'Save Changes' : 'Add Location'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
