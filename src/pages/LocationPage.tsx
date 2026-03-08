import { useState } from 'react';
import { Plus, Star } from 'lucide-react';

import { RootLayout } from '@/layouts/RootLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { useLocationsStore, type Location } from '@/store/locations-store';
import { LocationRow } from '@/features/locations/components/LocationRow';
import { LocationFormDialog } from '@/features/locations/components/LocationFormDialog';
import { DeleteLocationDialog } from '@/features/locations/components/DeleteLocationDialog';

export default function LocationPage() {
  const { locations, add, update, remove, setDefault } = useLocationsStore();

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Location | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Location | null>(null);

  const defaultLocation = locations.find((l) => l.isDefault);

  return (
    <RootLayout>
      <PageHeader
        title="Locations"
        description="Manage warehouse and workshop locations used across all manufacturing stages"
      >
        <Button className="gap-2" onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Location
        </Button>
      </PageHeader>

      {/* Summary strip */}
      <div className="flex items-center gap-3 mb-6 flex-wrap text-sm">
        <span className="text-muted-foreground">
          <span className="font-semibold text-foreground">
            {locations.length}
          </span>{' '}
          locations
        </span>
        <div className="h-4 w-px bg-border" />
        <span className="flex items-center gap-1 text-muted-foreground">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          Default:{' '}
          <span className="font-semibold text-foreground">
            {defaultLocation?.name ?? '—'}
          </span>
        </span>
      </div>

      {/* Flat list */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {locations.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
            No locations yet. Add one to get started.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {locations.map((loc) => (
              <LocationRow
                key={loc.id}
                loc={loc}
                onEdit={setEditTarget}
                onDelete={setDeleteTarget}
                onSetDefault={setDefault}
                totalCount={locations.length}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create dialog */}
      <LocationFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSave={(name) => add(name)}
      />

      {/* Edit dialog — key forces remount on each new target so useState re-initializes */}
      <LocationFormDialog
        key={editTarget?.id}
        open={!!editTarget}
        onOpenChange={(v) => !v && setEditTarget(null)}
        initial={editTarget ?? undefined}
        onSave={(name) => {
          if (editTarget) update(editTarget.id, name);
          setEditTarget(null);
        }}
      />

      {/* Delete confirmation */}
      <DeleteLocationDialog
        target={deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        onConfirm={(id) => {
          remove(id);
          setDeleteTarget(null);
        }}
      />
    </RootLayout>
  );
}
