import { useState } from 'react';
import { Package2, Plus, Search } from 'lucide-react';
import { RootLayout } from '@/layouts/RootLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BrandCard } from '@/features/brands/components/BrandCard';
import { MOCK_BRANDS } from '@/types/brand';

export default function Brands() {
  const [search, setSearch] = useState('');

  const filtered = MOCK_BRANDS.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.code.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <RootLayout>
      <PageHeader
        title="Manage Brands"
        description="Manage all the brands used in the factory. You can add new brands, edit existing ones, or delete them."
      >
        <Button className="gap-2 shrink-0">
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
          />
        </div>
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {filtered.length} brand{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Cards grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Package2 className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">No brands found</p>
          <p className="text-xs text-muted-foreground mt-1">
            Try a different search term or add a new brand.
          </p>
        </div>
      )}
    </RootLayout>
  );
}
