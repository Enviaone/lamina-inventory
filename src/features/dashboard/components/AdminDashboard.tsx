import {
  Package2,
  Layers,
  BoxesIcon,
  AlertTriangle,
  Activity,
  TrendingUp,
} from 'lucide-react';
import { KpiCard, KpiCardGroup } from '@/features/dashboard/components/KpiCard';
import { StagePipeline } from '@/features/dashboard/components/StagePipeline';
import { PendingTasksWidget } from '@/features/dashboard/components/PendingTasksWidget';
import { RecentActivity } from '@/features/dashboard/components/RecentActivity';
import { LocationInsights } from '@/features/dashboard/components/LocationInsights';
import {
  TOTAL_BRANDS,
  TOTAL_ITEMS,
  TOTAL_STOCK,
  PENDING_BRANDS,
  TOTAL_UNITS_TODAY,
  TOTAL_REJECTIONS_TODAY,
} from '@/features/dashboard/data/mock-dashboard';
import { format } from 'date-fns';

export function AdminDashboard() {
  const today = format(new Date(), 'EEEE, MMMM do');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Factory Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {today} · Administrator
        </p>
      </div>

      {/* KPI Cards — grouped container with dividers */}
      <KpiCardGroup className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard
          title="Brands"
          value={TOTAL_BRANDS}
          subtitle="active brands"
          icon={Package2}
        />
        <KpiCard
          title="Items"
          value={TOTAL_ITEMS}
          subtitle="across all brands"
          icon={Layers}
        />
        <KpiCard
          title="Total Stock"
          value={TOTAL_STOCK}
          subtitle="pieces in inventory"
          icon={BoxesIcon}
        />
        <KpiCard
          title="Pending Brands"
          value={PENDING_BRANDS.length}
          subtitle={
            PENDING_BRANDS.length > 0
              ? 'awaiting production'
              : 'All brands active'
          }
          icon={AlertTriangle}
        />
        <KpiCard
          title="Units Today"
          value={TOTAL_UNITS_TODAY}
          icon={TrendingUp}
          trend={{ value: '+12%', positive: true }}
        />
        <KpiCard
          title="Rejections"
          value={TOTAL_REJECTIONS_TODAY}
          subtitle="units rejected today"
          icon={Activity}
          trend={
            TOTAL_REJECTIONS_TODAY > 0
              ? { value: `${TOTAL_REJECTIONS_TODAY} pcs`, positive: false }
              : undefined
          }
        />
      </KpiCardGroup>

      {/* Pipeline */}
      <StagePipeline />

      {/* Bottom row: Low stock + Recent activity + Location Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
        <div className="lg:col-span-2">
          <PendingTasksWidget />
        </div>
        <div className="lg:col-span-2">
          <LocationInsights />
        </div>
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
