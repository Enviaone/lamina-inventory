import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ResponsiveDialog } from '@/components/shared/ResponsiveDialog';
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
  const [prevInitial, setPrevInitial] = useState<Location | undefined>(initial);
  const [name, setName] = useState(initial?.name ?? '');
  const isEdit = !!initial;

  if (initial !== prevInitial) {
    setPrevInitial(initial);
    setName(initial?.name ?? '');
  }

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
    <ResponsiveDialog
      open={open}
      onOpenChange={handleOpenChange}
      title={isEdit ? 'Edit Location' : 'Add Location'}
      description={
        isEdit
          ? 'Update location details below.'
          : 'Enter the details for the new location.'
      }
    >
      <LocationFormInputs
        name={name}
        setName={setName}
        onSave={handleSave}
        isEdit={isEdit}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
}

function LocationFormInputs({
  name,
  setName,
  onSave,
  isEdit,
  onCancel,
}: {
  name: string;
  setName: (v: string) => void;
  onSave: () => void;
  isEdit: boolean;
  onCancel: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 py-2">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="loc-name">Name</Label>
        <Input
          id="loc-name"
          placeholder="e.g. Chennai Warehouse"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSave()}
        />
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
        <Button onClick={onSave} disabled={!name.trim()}>
          {isEdit ? 'Save Changes' : 'Add Location'}
        </Button>
      </div>
    </div>
  );
}
