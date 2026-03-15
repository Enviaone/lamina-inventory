import { MapPin } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useLocationsStore } from '@/store/locations-store';
import { useLogStore } from '@/store/log-store';
import { Badge } from '@/components/ui/badge';
import type { Location } from '@/store/locations-store';

export function LocationInsights() {
  const { locations } = useLocationsStore();
  const { logs } = useLogStore();

  // Aggregate stats per location
  const stats = locations.map((loc: Location) => {
    const locLogs = logs.filter((l) => l.data.location === loc.name);
    const totalInput = locLogs.reduce(
      (acc, l) => acc + (parseFloat(l.data.inputQty || '0') || 0),
      0,
    );
    const totalProduction = locLogs.reduce(
      (acc, l) => acc + (parseFloat(l.data.productionQty || '0') || 0),
      0,
    );
    const totalRejections = locLogs.reduce(
      (acc, l) => acc + (parseFloat(l.data.rejectionQty || '0') || 0),
      0,
    );

    return {
      id: loc.id,
      name: loc.name,
      input: totalInput,
      production: totalProduction,
      rejections: totalRejections,
    };
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold">
              Multi-Location Insights
            </CardTitle>
            <CardDescription className="text-xs">
              Production distribution across sites
            </CardDescription>
          </div>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.slice(0, 5).map((loc) => (
            <div
              key={loc.id}
              className="flex items-center justify-between group"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors cursor-default">
                  {loc.name}
                </p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="text-[10px] font-normal py-0 px-1.5 h-4"
                  >
                    {loc.production} units
                  </Badge>
                  {loc.rejections > 0 && (
                    <span className="text-[10px] text-destructive">
                      {loc.rejections} rejections
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold">
                  {loc.production > 0
                    ? ((loc.production / (loc.input || 1)) * 100).toFixed(1)
                    : '0'}
                  %
                </p>
                <p className="text-[10px] text-muted-foreground">Efficiency</p>
              </div>
            </div>
          ))}
          {stats.length === 0 && (
            <div className="text-center py-6 text-muted-foreground text-sm">
              No location data available.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
