import { useState } from 'react';
import { Package2, Plus, Search, Loader2, TriangleAlert } from 'lucide-react';
import { RootLayout } from '@/layouts/RootLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BrandCard } from '@/features/brands/components/BrandCard';
import { type Brand } from '@/types/brand';
import { BrandFormDialog } from '@/features/brands/components/BrandFormDialog';
import { type BrandFormSchema } from '@/schema/brand.schema';
import { DeleteBrandDialog } from '@/features/brands/components/DeleteBrandDialog';
import {
  useBrands,
  useCreateBrand,
  useUpdateBrand,
  useDeleteBrand,
} from '@/hooks/queries/useBrands';
import { EmptyState } from '@/components/ui/empty';
import { useDebounce } from '@/hooks/use-debounce';

export default function Brands() {
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Brand | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const {
    data: brands = [],
    isLoading,
    isError,
    error,
  } = useBrands(debouncedSearch);
  const createBrandMutation = useCreateBrand();
  const updateBrandMutation = useUpdateBrand();
  const deleteBrandMutation = useDeleteBrand();


  const handleSaveBrand = (data: BrandFormSchema) => {
    if (editTarget) {
      updateBrandMutation.mutate(
        {
          id: editTarget.id,
          data: {
            name: data.name,
          },
        },
        {
          onSuccess: () => {
            setEditTarget(null);
            setIsDialogOpen(false);
          },
        },
      );
    } else {
      createBrandMutation.mutate(
        {
          name: data.name,
        },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
          },
        },
      );
    }
  };

  const handleDeleteBrand = () => {
    if (deleteTarget) {
      deleteBrandMutation.mutate(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <RootLayout>
      <PageHeader
        title="Manage Brands"
        description="Manage all the brands used in the factory. You can add new brands, edit existing ones, or delete them."
      >
        <Button
          className="gap-2 shrink-0"
          onClick={() => {
            setEditTarget(null);
            setIsDialogOpen(true);
          }}
          disabled={isLoading}
        >
          <Plus className="w-4 h-4" />
          Add Brand
        </Button>
      </PageHeader>

      {/* Search + count */}
      <div className="flex items-center justify-between gap-4 mt-2 mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search brands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            disabled={isLoading}
          />
        </div>
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {isLoading
            ? 'Loading...'
            : `${brands.length} brand${brands.length !== 1 ? 's' : ''}`}
        </span>
      </div>

      {/* Content grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
          <p className="text-sm font-medium text-foreground">
            Loading brands...
          </p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <EmptyState
            title="Error loading brands"
            description={
              (error as Error)?.message ||
              'Something went wrong. Please try again later.'
            }
            icons={[TriangleAlert]}
            className="bg-transparent"
          />
        </div>
      ) : brands.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.map((brand) => (
            <BrandCard
              key={brand.id}
              brand={brand}
              onEdit={(b) => setEditTarget(b)}
              onDelete={(b) => setDeleteTarget(b)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <EmptyState
            title="No Brands Created"
            description="You can create a new brand to add in your pages."
            icons={[Package2]}
            action={{
              label: 'Create Brand',
              onClick: () => {
                setEditTarget(null);
                setIsDialogOpen(true);
              },
            }}
            className="bg-transparent"
          />
        </div>
      )}

      {/* Dialog */}
      <BrandFormDialog
        open={isDialogOpen || !!editTarget}
        onOpenChange={(v) => {
          if (!v) {
            setIsDialogOpen(false);
            setEditTarget(null);
          } else {
            setIsDialogOpen(true);
          }
        }}
        initial={editTarget || undefined}
        onSave={handleSaveBrand}
        isSubmitting={
          createBrandMutation.isPending || updateBrandMutation.isPending
        }
      />

      {/* Delete Confirmation */}
      <DeleteBrandDialog
        brand={deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        onConfirm={handleDeleteBrand}
        isDeleting={deleteBrandMutation.isPending}
      />
    </RootLayout>
  );
}
