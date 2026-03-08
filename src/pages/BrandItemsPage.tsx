import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, ClipboardCheck, Package2, Search } from 'lucide-react';

import { RootLayout } from '@/layouts/RootLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MOCK_BRANDS, type BrandItem } from '@/types/brand';
import {
  BRAND_COLOR_MAP,
  type BrandColorKey,
} from '@/features/brands/constants/colorMap';
import { PageHeader } from '@/components/shared/PageHeader';

export default function BrandItemsPage() {
  const { brandId } = useParams<{ brandId: string }>();

  const [search, setSearch] = useState('');
  /** qty per item id */
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [reviewOpen, setReviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const brand = MOCK_BRANDS.find((b) => b.id === brandId);

  if (!brand) {
    return (
      <RootLayout>
        <div className="flex flex-col items-center justify-center min-h-64 gap-3 text-center">
          <Package2 className="w-10 h-10 text-muted-foreground" />
          <p className="font-medium text-foreground">Brand not found</p>
        </div>
      </RootLayout>
    );
  }

  const colorKey: BrandColorKey =
    brand.color in BRAND_COLOR_MAP ? (brand.color as BrandColorKey) : 'blue';
  const colors = BRAND_COLOR_MAP[colorKey];

  const filteredItems = brand.items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()),
  );

  const filledItems = brand.items.filter(
    (item) => quantities[item.id] && parseFloat(quantities[item.id]) > 0,
  );

  const handleQtyChange = (itemId: string, value: string) => {
    setQuantities((prev) => ({ ...prev, [itemId]: value }));
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsSubmitting(false);
    setReviewOpen(false);
    setQuantities({});
  };

  return (
    <RootLayout>
      <PageHeader title={brand.name} description={brand.code} />
      {/* ── Single card: toolbar header + items list ── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {/* Toolbar row — matches reference: search | date | action */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 bg-transparent border-0 shadow-none focus-visible:ring-0 text-sm placeholder:text-muted-foreground"
            />
          </div>

          <div className="h-5 w-px bg-border shrink-0" />

          {/* Review & Record */}
          <Button
            size="sm"
            className="gap-2 shrink-0 h-9"
            onClick={() => setReviewOpen(true)}
          >
            <ClipboardCheck className="w-4 h-4" />
            Review &amp; Record
          </Button>
        </div>

        {/* ── Column headers ── */}
        <div className="flex items-center gap-4 px-5 py-2.5 bg-muted/40 border-b border-border">
          <div className="w-10 shrink-0" />
          <div className="flex-1 text-xs font-semibold text-foreground">
            Item
          </div>
          <div className="w-44 text-xs font-semibold text-foreground text-right pr-1">
            Quantity
          </div>
          <div className="w-24 text-xs font-semibold text-foreground text-right">
            Unit
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2 text-muted-foreground text-sm">
            <Package2 className="w-8 h-8" />
            <p>No items found</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filteredItems.map((item) => {
              const isLow = item.currentStock <= item.lowStockThreshold;
              const isCritical =
                item.currentStock <= item.lowStockThreshold * 0.5;
              const qty = quantities[item.id] ?? '';

              return (
                <li
                  key={item.id}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors group"
                >
                  {/* Colored icon */}
                  <div
                    className={`w-10 h-10 rounded-xl ${colors.iconBg} flex items-center justify-center shrink-0`}
                  >
                    <Package2 className={`w-5 h-5 ${colors.iconText}`} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm leading-tight">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.sku}
                    </p>
                    <p className="text-xs mt-0.5">
                      <span className="text-muted-foreground">
                        Current Stock:{' '}
                      </span>
                      <span
                        className={
                          isCritical
                            ? 'text-red-600 font-semibold'
                            : isLow
                              ? 'text-amber-600 font-semibold'
                              : 'text-foreground font-medium'
                        }
                      >
                        {item.currentStock.toLocaleString('en-IN')} Pieces
                      </span>
                      {(isLow || isCritical) && (
                        <span
                          className={`ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${isCritical ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}
                        >
                          {isCritical ? 'Critical' : 'Low Stock'}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Quantity input */}
                  <div className="w-44 shrink-0">
                    <Input
                      id={`qty-${item.id}`}
                      type="number"
                      min={0}
                      placeholder="Quantity"
                      value={qty}
                      onChange={(e) => handleQtyChange(item.id, e.target.value)}
                      className="h-9 text-sm text-right"
                    />
                  </div>

                  {/* Unit label */}
                  <div className="w-24 shrink-0 text-sm text-muted-foreground text-right">
                    Pieces
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-3 px-1">
        {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} ·{' '}
        {filledItems.length} filled
      </p>

      {/* ── Review & Record Dialog ── */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] flex flex-col gap-0 p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
            <DialogTitle className="flex items-center gap-2 text-base">
              <ClipboardCheck className="w-5 h-5 text-primary" />
              Review &amp; Record
            </DialogTitle>
            <DialogDescription className="text-sm mt-1">
              Confirm quantities for{' '}
              <span className="font-medium text-foreground">{brand.name}</span>.
              Only filled items are shown.
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto flex-1 px-6 py-4">
            {filledItems.length === 0 ? (
              <p className="text-sm text-center text-muted-foreground py-8">
                No quantities entered yet. Fill in at least one item to record.
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-2 pr-4 font-semibold text-foreground text-xs">
                      Item
                    </th>
                    <th className="pb-2 pr-2 font-semibold text-foreground text-xs text-right">
                      Quantity
                    </th>
                    <th className="pb-2 font-semibold text-foreground text-xs">
                      Unit
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filledItems.map((item: BrandItem) => (
                    <tr key={item.id} className="hover:bg-muted/30">
                      <td className="py-2.5 pr-4">
                        <p className="font-medium text-foreground leading-tight">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {item.sku}
                        </p>
                      </td>
                      <td className="py-2.5 pr-2 text-right">
                        <span className="font-bold text-foreground">
                          {parseFloat(quantities[item.id]).toLocaleString(
                            'en-IN',
                          )}
                        </span>
                      </td>
                      <td className="py-2.5 text-muted-foreground text-xs">
                        Pieces
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-border bg-muted/40">
                    <td className="py-2.5 pr-4 font-bold text-xs text-foreground">
                      Total ({filledItems.length} item
                      {filledItems.length !== 1 ? 's' : ''})
                    </td>
                    <td className="py-2.5 pr-2 text-right font-bold text-foreground">
                      {filledItems
                        .reduce(
                          (s, item) =>
                            s + (parseFloat(quantities[item.id]) || 0),
                          0,
                        )
                        .toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 text-muted-foreground text-xs">
                      Pieces
                    </td>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>

          <DialogFooter className="px-6 py-4 border-t border-border gap-2">
            <Button
              variant="outline"
              onClick={() => setReviewOpen(false)}
              disabled={isSubmitting}
            >
              Back to Edit
            </Button>
            <Button
              onClick={handleConfirmSubmit}
              disabled={filledItems.length === 0 || isSubmitting}
              className="gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmitting ? 'Saving…' : 'Confirm & Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </RootLayout>
  );
}
