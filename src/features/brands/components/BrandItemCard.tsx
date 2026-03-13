import { MoreVertical, Package2, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Brand, type BrandItem } from '@/types/brand';

interface BrandItemCardProps {
  item: BrandItem;
  brand: Brand;
  onEdit: (item: BrandItem) => void;
  onDelete: (item: BrandItem) => void;
}

export function BrandItemCard({
  item,
  onEdit,
  onDelete,
}: BrandItemCardProps) {
  return (
    <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-card hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-4">
        {/* Neutral colored icon */}
        <div
          className="w-11 h-11 rounded-[14px] bg-blue-100 flex items-center justify-center shrink-0"
        >
          <Package2 className="w-5 h-5 text-blue-600" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-[15px] leading-tight">
            {item.name}
          </p>
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
