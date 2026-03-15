import { Activity, TrendingUp, BarChart3, Star } from 'lucide-react';
import { KpiCard, KpiCardGroup } from '@/features/dashboard/components/KpiCard';
import { StagePipeline } from '@/features/dashboard/components/StagePipeline';
import { RecentActivity } from '@/features/dashboard/components/RecentActivity';
import { TodaysRejection } from '@/features/dashboard/components/TodaysRejection';
import { format } from 'date-fns';
import { useLogStore } from '@/store/log-store';

export function AdminDashboard() {
  const today = format(new Date(), 'EEEE, MMMM do');
  const logs = useLogStore((s) => s.logs);

  // Derived Analytics from Real Logs
  const analytics = logs.reduce(
    (acc, log) => {
      const input = parseInt(log.data.inputQty || '0');
      const output = parseInt(log.data.productionQty || '0');
      const rejects = parseInt(log.data.rejectionQty || '0');

      acc.totalInput += input;
      acc.totalOutput += output;
      acc.totalRejections += rejects;

      // Brand performance
      acc.brandOutput[log.brandName] =
        (acc.brandOutput[log.brandName] || 0) + output;

      // Shift throughput
      acc.shiftOutput[log.shift] = (acc.shiftOutput[log.shift] || 0) + output;

      return acc;
    },
    {
      totalInput: 0,
      totalOutput: 0,
      totalRejections: 0,
      brandOutput: {} as Record<string, number>,
      shiftOutput: {} as Record<string, number>,
    },
  );

  // Calculate top brand
  const topBrandEntry = Object.entries(analytics.brandOutput).sort(
    ([, a], [, b]) => b - a,
  )[0];

  const topBrand = topBrandEntry
    ? { name: topBrandEntry[0], qty: topBrandEntry[1] }
    : null;

  // Shift performance
  const bestShiftEntry = Object.entries(analytics.shiftOutput).sort(
    ([, a], [, b]) => b - a,
  )[0];

  return (
    <div className="space-y-6">
      {/* Header with Spotlight */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Factory Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {today} · Administrator
          </p>
        </div>

        {topBrand && (
          <div className="hidden items-center gap-3 bg-primary/5 border border-primary/10 px-4 py-2 rounded-2xl animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Star className="w-4 h-4 text-primary fill-primary/20" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
                Top Performance Today
              </p>
              <p className="text-sm font-bold text-foreground">
                {topBrand.name}{' '}
                <span className="text-muted-foreground font-normal ml-1">
                  ({topBrand.qty.toLocaleString()} units)
                </span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* KPI Cards — grouped container with dividers */}
      <KpiCardGroup className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Yield Rate"
          value={
            analytics.totalInput > 0
              ? `${Math.round((analytics.totalOutput / analytics.totalInput) * 100)}%`
              : '—'
          }
          subtitle="efficiency ratio"
          icon={Activity}
          trend={
            analytics.totalOutput > 1000
              ? { value: '+2.4%', positive: true }
              : undefined
          }
        />
        <KpiCard
          title="Shift Peak"
          value={bestShiftEntry ? bestShiftEntry[0] : '—'}
          subtitle={
            bestShiftEntry
              ? `${bestShiftEntry[1].toLocaleString()} units`
              : 'no logs today'
          }
          icon={BarChart3}
        />
        <KpiCard
          title="Produced Today"
          value={analytics.totalOutput}
          icon={TrendingUp}
          trend={{ value: '+12%', positive: true }}
        />
        <KpiCard
          title="Total Rejections"
          value={analytics.totalRejections}
          subtitle="units flagged today"
          icon={Activity}
          trend={
            analytics.totalRejections > 0
              ? { value: `${analytics.totalRejections} pcs`, positive: false }
              : undefined
          }
        />
      </KpiCardGroup>

      {/* Pipeline */}
      <StagePipeline />

      {/* Bottom row: Traffic + Insights + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
        <div className="lg:col-span-3">
          <TodaysRejection />
        </div>
        <div className="lg:col-span-3">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
