import { MoreVertical, Package2, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  BRAND_COLOR_MAP,
  type BrandColorKey,
} from '@/features/brands/constants/colorMap';
import { type Brand, type BrandItem } from '@/types/brand';

interface BrandItemCardProps {
  item: BrandItem;
  brand: Brand;
  onEdit: (item: BrandItem) => void;
  onDelete: (item: BrandItem) => void;
}

export function BrandItemCard({
  item,
  brand,
  onEdit,
  onDelete,
}: BrandItemCardProps) {
  const colorKey: BrandColorKey =
    brand.color in BRAND_COLOR_MAP ? (brand.color as BrandColorKey) : 'blue';
  const colors = BRAND_COLOR_MAP[colorKey];

  return (
    <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-card hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-4">
        {/* Colored icon */}
        <div
          className={`w-11 h-11 rounded-[14px] ${colors.iconBg} flex items-center justify-center shrink-0`}
        >
          <Package2 className={`w-5 h-5 ${colors.iconText}`} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-[15px] leading-tight mb-0.5">
            {item.name}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{item.sku}</span>
          </div>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground shrink-0 hover:bg-muted/50 rounded-full"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            className="gap-2 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
          >
            <Pencil className="w-4 h-4" /> Edit Item
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="gap-2 cursor-pointer text-destructive focus:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item);
            }}
          >
            <Trash2 className="w-4 h-4" /> Delete Item
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
