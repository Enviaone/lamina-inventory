import { Eye, MoreVertical, Package2, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BRAND_COLOR_MAP } from '@/features/brands/constants/colorMap';
import { type Brand } from '@/types/brand';

interface BrandCardProps {
  brand: Brand;
}

export function BrandCard({ brand }: BrandCardProps) {
  const colors = BRAND_COLOR_MAP[brand.color] ?? BRAND_COLOR_MAP.blue;

  const totalStock = brand.items.reduce((s, i) => s + i.currentStock, 0);
  const totalLowStockThreshold = brand.items.reduce(
    (s, i) => s + i.lowStockThreshold,
    0,
  );
  const isLowStock = totalStock <= totalLowStockThreshold;

  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl ${colors.iconBg} flex items-center justify-center shrink-0`}
          >
            <Package2 className={`w-5 h-5 ${colors.iconText}`} />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm leading-tight">
              {brand.name}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{brand.code}</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-muted-foreground"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <Eye className="w-4 h-4" /> View Items
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <Pencil className="w-4 h-4" /> Edit Brand
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive">
              <Trash2 className="w-4 h-4" /> Delete Brand
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stock */}
      <div className="text-center py-1">
        <p className={`text-3xl font-bold ${colors.stock} tracking-tight`}>
          {totalStock.toLocaleString('en-IN')}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Total Stock (in Pieces)
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed border-border" />

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">
            {brand.items.length} item{brand.items.length !== 1 ? 's' : ''}
          </span>
          {isLowStock && (
            <Badge
              variant="destructive"
              className="text-[10px] px-1.5 py-0 h-4"
            >
              Low Stock
            </Badge>
          )}
        </div>
        <Badge variant="outline" className="text-xs font-medium">
          {totalLowStockThreshold.toLocaleString('en-IN')} threshold
        </Badge>
      </div>
    </div>
  );
}
