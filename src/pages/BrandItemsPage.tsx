import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Package2, Plus, Search, Loader2 } from 'lucide-react';

import { RootLayout } from '@/layouts/RootLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { BrandItem } from '@/types/brand';
import { PageHeader } from '@/components/shared/PageHeader';

import { BrandItemCard } from '@/features/brands/components/BrandItemCard';
import { BrandItemFormDialog } from '@/features/brands/components/BrandItemFormDialog';
import { DeleteBrandItemDialog } from '@/features/brands/components/DeleteBrandItemDialog';
import type { BrandItemFormSchema } from '@/schema/brand.schema';
import {
  useBrand,
  useBrandItems,
  useAddBrandItem,
  useUpdateBrandItem,
  useDeleteBrandItem,
} from '@/hooks/queries/useBrands';
import { useDebounce } from '@/hooks/use-debounce';
import { EmptyState } from '@/components/ui/empty';

export default function BrandItemsPage() {
  const { brandId = '' } = useParams<{ brandId: string }>();
  const [search, setSearch] = useState('');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<BrandItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BrandItem | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const { data: brand, isLoading: isBrandLoading } = useBrand(brandId);
  const {
    data: items = [],
    isLoading: isItemsLoading,
    isError,
    error,
  } = useBrandItems(brandId, debouncedSearch);

  const addMutation = useAddBrandItem(brandId);
  const updateMutation = useUpdateBrandItem(brandId);
  const deleteMutation = useDeleteBrandItem(brandId);

  const isLoading = isBrandLoading || isItemsLoading;

  if (!brand && !isLoading) {
    return (
      <RootLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <EmptyState
            title="Brand not found"
            description="The brand you're looking for doesn't exist."
            icons={[Package2]}
          />
        </div>
      </RootLayout>
    );
  }


  const handleSaveItem = (data: BrandItemFormSchema) => {
    if (editTarget) {
      updateMutation.mutate(
        { itemId: editTarget.id, data },
        {
          onSuccess: () => {
            setEditTarget(null);
            setIsDialogOpen(false);
          },
        },
      );
    } else {
      addMutation.mutate(
        {
          ...data,
        },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
          },
        },
      );
    }
  };

  const handleDeleteItem = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id, {
        onSuccess: () => {
          setDeleteTarget(null);
        },
      });
    }
  };

  return (
    <RootLayout>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
          <p className="text-sm font-medium text-foreground">
            Loading brand data...
          </p>
        </div>
      ) : (
        <>
          <PageHeader title={brand?.name ?? ''} description="">
            <Button
              className="gap-2 shrink-0"
              onClick={() => {
                setEditTarget(null);
                setIsDialogOpen(true);
              }}
              disabled={isLoading}
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
              {items.length} item{items.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Content grid */}
          {isError ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-sm font-medium text-destructive">
                Error loading items
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {(error as Error)?.message || 'Something went wrong'}
              </p>
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <BrandItemCard
                  key={item.id}
                  item={item}
                  brand={brand!}
                  onEdit={(i) => setEditTarget(i)}
                  onDelete={(i) => setDeleteTarget(i)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No items found"
              description="Try a different search term or add a new item."
              icons={[Package2]}
              action={{
                label: 'Add Item',
                onClick: () => {
                  setEditTarget(null);
                  setIsDialogOpen(true);
                },
              }}
            />
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
            brandName={brand?.name ?? ''}
            initial={editTarget || undefined}
            onSave={handleSaveItem}
            isSubmitting={addMutation.isPending || updateMutation.isPending}
          />

          <DeleteBrandItemDialog
            item={deleteTarget}
            onOpenChange={(v) => !v && setDeleteTarget(null)}
            onConfirm={handleDeleteItem}
            isDeleting={deleteMutation.isPending}
          />
        </>
      )}
    </RootLayout>
  );
}
