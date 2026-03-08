import { MapPin, Pencil, Star, StarOff, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Location } from '@/store/locations-store';

export interface LocationRowProps {
  loc: Location;
  onEdit: (loc: Location) => void;
  onDelete: (loc: Location) => void;
  onSetDefault: (id: string) => void;
  totalCount: number;
}

export function LocationRow({
  loc,
  onEdit,
  onDelete,
  onSetDefault,
  totalCount,
}: LocationRowProps) {
  return (
    <div
      className={`flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-muted/30 ${
        loc.isDefault ? 'bg-primary/5' : ''
      }`}
    >
      {/* Icon */}
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
          loc.isDefault ? 'bg-primary/10' : 'bg-muted'
        }`}
      >
        <MapPin
          className={`w-4 h-4 ${loc.isDefault ? 'text-primary' : 'text-muted-foreground'}`}
        />
      </div>

      {/* Name + default badge */}
      <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
        <span
          className={`text-sm font-medium ${
            loc.isDefault ? 'text-primary' : 'text-foreground'
          }`}
        >
          {loc.name}
        </span>
        {loc.isDefault && (
          <Badge className="text-[10px] px-1.5 h-4 bg-primary/15 text-primary border-primary/30 hover:bg-primary/15">
            Default
          </Badge>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5 shrink-0">
        {loc.isDefault ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-amber-500 cursor-default"
            title="Default location"
          >
            <Star className="w-3.5 h-3.5 fill-amber-500" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-amber-500"
            title="Set as default"
            onClick={() => onSetDefault(loc.id)}
          >
            <StarOff className="w-3.5 h-3.5" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title="Edit"
          onClick={() => onEdit(loc)}
        >
          <Pencil className="w-3.5 h-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          title="Delete"
          onClick={() => onDelete(loc)}
          disabled={loc.isDefault && totalCount === 1}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
