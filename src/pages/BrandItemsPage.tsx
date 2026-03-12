import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Package2, Plus, Search } from 'lucide-react';

import { RootLayout } from '@/layouts/RootLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MOCK_BRANDS, type BrandItem } from '@/types/brand';
import { PageHeader } from '@/components/shared/PageHeader';

import { BrandItemCard } from '@/features/brands/components/BrandItemCard';
import { BrandItemFormDialog } from '@/features/brands/components/BrandItemFormDialog';
import { DeleteBrandItemDialog } from '@/features/brands/components/DeleteBrandItemDialog';
import { type BrandItemFormSchema } from '@/schema/brand.schema';

export default function BrandItemsPage() {
  const { brandId } = useParams<{ brandId: string }>();
  const [search, setSearch] = useState('');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<BrandItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BrandItem | null>(null);

  const brand = MOCK_BRANDS.find((b) => b.id === brandId);

  if (!brand) {
    return (
      <RootLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Package2 className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">Brand not found</p>
          <p className="text-xs text-muted-foreground mt-1">
            The brand you're looking for doesn't exist.
          </p>
        </div>
      </RootLayout>
    );
  }

  const filteredItems = brand.items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSaveItem = (data: BrandItemFormSchema) => {
    // TODO: Wire to actual store or API
    if (editTarget) {
      console.log('Updated item:', {
        ...data,
        id: editTarget.id,
        brandId: brand.id,
      });
      setEditTarget(null);
    } else {
      console.log('Saved new item for brand', brand.id, ':', data);
    }
    setIsDialogOpen(false);
  };

  const handleDeleteItem = () => {
    if (deleteTarget) {
      // TODO: Wire to actual store or API
      console.log(
        'Deleted item ID:',
        deleteTarget.id,
        'for brand ID:',
        brand.id,
      );
      setDeleteTarget(null);
    }
  };

  return (
    <RootLayout>
      <PageHeader title={brand.name} description={brand.code}>
        <Button
          className="gap-2 shrink-0"
          onClick={() => {
            setEditTarget(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </PageHeader>

      {/* Search + count */}
      <div className="flex items-center justify-between gap-4 mt-2 mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Cards grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <BrandItemCard
              key={item.id}
              item={item}
              brand={brand}
              onEdit={(i) => setEditTarget(i)}
              onDelete={(i) => setDeleteTarget(i)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Package2 className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">No items found</p>
          <p className="text-xs text-muted-foreground mt-1">
            Try a different search term or add a new item.
          </p>
        </div>
      )}

      {/* Dialogs */}
      <BrandItemFormDialog
        open={isDialogOpen || !!editTarget}
        onOpenChange={(v) => {
          if (!v) {
            setIsDialogOpen(false);
            setEditTarget(null);
          } else {
            setIsDialogOpen(true);
          }
        }}
        brandName={brand.name}
        initial={editTarget || undefined}
        onSave={handleSaveItem}
      />

      <DeleteBrandItemDialog
        item={deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        onConfirm={handleDeleteItem}
      />
    </RootLayout>
  );
}
