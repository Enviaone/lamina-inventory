import { useState } from 'react';
import { Download, FileText, Search, Plus } from 'lucide-react';

import { RootLayout } from '@/layouts/RootLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// ─── Mock Data ─────────────────────────────────────────────────────────────

const MOCK_REPORTS = [
  {
    id: 'REP-001',
    name: 'Master Factory Production Summary',
    type: 'Production',
    date: 'Mar 08, 2026',
    status: 'Ready',
  },
  {
    id: 'REP-002',
    name: 'Inspection & Rejection Analysis',
    type: 'Quality',
    date: 'Mar 07, 2026',
    status: 'Ready',
  },
  {
    id: 'REP-003',
    name: 'Outward/Inward Transfer Log',
    type: 'Logistics',
    date: 'Mar 06, 2026',
    status: 'Processing',
  },
  {
    id: 'REP-004',
    name: 'Brand-Wise Stage Tracking',
    type: 'Inventory',
    date: 'Mar 01, 2026',
    status: 'Ready',
  },
  {
    id: 'REP-005',
    name: 'External Processing Reconciliation',
    type: 'Audit',
    date: 'Feb 28, 2026',
    status: 'Archived',
  },
  {
    id: 'REP-006',
    name: 'Daily Shift Performance (S1-S4)',
    type: 'Performance',
    date: 'Feb 27, 2026',
    status: 'Archived',
  },
];

export default function ReportsPage() {
  const [search, setSearch] = useState('');

  const filtered = MOCK_REPORTS.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <RootLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <PageHeader
          title="Reports"
          description="View and download system reports"
        />
        <Button className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          Generate Report
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 bg-transparent border-0 shadow-none focus-visible:ring-0 text-sm placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Column headers */}
        <div className="hidden sm:flex items-center gap-4 px-5 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide border-b border-border bg-muted/30">
          <div className="w-10 shrink-0" />
          <div className="flex-2">Name</div>
          <div className="flex-1">Type</div>
          <div className="w-32">Generated Date</div>
          <div className="w-24">Status</div>
          <div className="w-24 text-right">Actions</div>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground bg-card">
            No reports found matching your criteria.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((report) => (
              <div
                key={report.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-3 hover:bg-muted/30 transition-colors bg-card"
              >
                <div className="w-10 shrink-0 hidden sm:flex items-center justify-center">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex-2 min-w-0">
                  <div className="font-medium text-foreground truncate">
                    {report.name}
                  </div>
                  <div className="text-xs text-muted-foreground sm:hidden mt-0.5">
                    {report.type} • {report.date}
                  </div>
                </div>

                <div className="flex-1 hidden sm:block text-sm text-foreground truncate">
                  {report.type}
                </div>

                <div className="w-32 hidden sm:block text-sm text-muted-foreground">
                  {report.date}
                </div>

                <div className="w-24 hidden sm:flex items-center">
                  <Badge
                    variant="secondary"
                    className={
                      report.status === 'Ready'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 shadow-none font-medium'
                        : report.status === 'Processing'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 shadow-none font-medium'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80 shadow-none font-medium'
                    }
                  >
                    {report.status}
                  </Badge>
                </div>

                <div className="w-24 shrink-0 flex items-center justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 sm:w-auto sm:px-3 sm:gap-1.5 text-muted-foreground hover:text-foreground"
                  >
                    <Download className="w-4 h-4" />
                    <span className="sr-only sm:not-sr-only">Download</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RootLayout>
  );
}
