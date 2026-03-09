import { MoreVertical, Package2, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
import { type Brand } from '@/types/brand';

interface BrandCardProps {
  brand: Brand;
  onEdit: (brand: Brand) => void;
  onDelete: (brand: Brand) => void;
}

export function BrandCard({ brand, onEdit, onDelete }: BrandCardProps) {
  const navigate = useNavigate();
  const colorKey: BrandColorKey =
    brand.color in BRAND_COLOR_MAP ? (brand.color as BrandColorKey) : 'blue';
  const colors = BRAND_COLOR_MAP[colorKey];

  return (
    <div
      className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/brands/${brand.id}`)}
    >
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
                onEdit(brand);
              }}
            >
              <Pencil className="w-4 h-4" /> Edit Brand
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 cursor-pointer text-destructive focus:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(brand);
              }}
            >
              <Trash2 className="w-4 h-4" /> Delete Brand
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
