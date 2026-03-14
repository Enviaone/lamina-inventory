import { useState } from 'react';
import {
  ClipboardList,
  Package2,
  TrendingUp,
  BoxesIcon,
  Search,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { RootLayout } from '@/layouts/RootLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { useLogStore, type LogEntry } from '@/store/log-store';
import { useAuthStore } from '@/store/auth-store';
import { EditLogDialog } from '@/features/logs/components/EditLogDialog';
import { LogCard } from '@/features/logs/components/LogCard';
import { KpiCard, KpiCardGroup } from '@/features/dashboard/components/KpiCard';
import { STAGE_OPTIONS } from '@/features/stages/config/stage-config';

export default function LogPage() {
  const { logs, updateEntry, deleteEntry } = useLogStore();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'ADMIN';

  const [editTarget, setEditTarget] = useState<LogEntry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LogEntry | null>(null);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<string[]>([]);

  const toggleStageFilter = (stageId: string) =>
    setStageFilter((prev) =>
      prev.includes(stageId)
        ? prev.filter((id) => id !== stageId)
        : [...prev, stageId],
    );

  const visibleLogs = (
    isAdmin ? logs : logs.filter((l) => l.userId === user?.id)
  )
    .filter(
      (l) =>
        (l.brandName.toLowerCase().includes(search.toLowerCase()) ||
          l.itemName.toLowerCase().includes(search.toLowerCase()) ||
          l.stageLabel.toLowerCase().includes(search.toLowerCase())) &&
        (stageFilter.length === 0 || stageFilter.includes(l.stageId)),
    )
    .slice()
    .sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
    );

  // Stats should be based on filtered logs or total available logs? Usually filtered for dashboard feel.
  const stats = visibleLogs.reduce(
    (acc, log) => {
      acc.totalInput += parseInt(log.data.inputQty || '0') || 0;
      acc.totalProduced += parseInt(log.data.productionQty || '0') || 0;
      acc.brands.add(log.brandId);
      return acc;
    },
    { totalInput: 0, totalProduced: 0, brands: new Set<string>() },
  );

  return (
    <RootLayout>
      <PageHeader
        title="Activity Logs"
        description={
          isAdmin
            ? 'Complete history of all stage entries across all users'
            : 'Your submitted stage entries'
        }
      />

      {/* Stats Cards */}
      <KpiCardGroup className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 mb-6">
        <KpiCard
          title="Total Inputs"
          value={stats.totalInput}
          subtitle="across all logged stages"
          icon={TrendingUp}
        />
        <KpiCard
          title="Produced Units"
          value={stats.totalProduced}
          subtitle="successfully completed"
          icon={BoxesIcon}
        />
        <KpiCard
          title="Total Brands"
          value={stats.brands.size}
          subtitle="contributing to logs"
          icon={Package2}
        />
      </KpiCardGroup>

      {/* Content Card */}
      <div className="rounded-2xl border border-border bg-card">
        {/* Toolbar - Sticky */}
        <div className="sticky top-0 z-20 bg-card/95 backdrop-blur-md flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2 px-4 py-3 border-b border-border rounded-t-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search logs by item, brand or stage..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 bg-muted/50 sm:bg-transparent border sm:border-0 shadow-none focus-visible:ring-0 text-sm placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 gap-1.5 text-muted-foreground font-normal shrink-0"
                >
                  Stage
                  {stageFilter.length > 0 && (
                    <Badge className="h-4 w-4 p-0 flex items-center justify-center text-[10px] rounded-full">
                      {stageFilter.length}
                    </Badge>
                  )}
                  <ChevronDown className="w-3.5 h-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Filter by stage
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {STAGE_OPTIONS.map((s) => (
                  <DropdownMenuCheckboxItem
                    key={s.id}
                    checked={stageFilter.includes(s.id)}
                    onCheckedChange={() => toggleStageFilter(s.id)}
                  >
                    {s.label}
                  </DropdownMenuCheckboxItem>
                ))}
                {stageFilter.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel
                      className="text-xs text-destructive cursor-pointer hover:text-destructive/80"
                      onClick={() => setStageFilter([])}
                    >
                      Clear filter
                    </DropdownMenuLabel>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="hidden sm:block h-5 w-px bg-border shrink-0" />

            <div className="text-xs text-muted-foreground px-2 whitespace-nowrap">
              {visibleLogs.length} entries
            </div>
          </div>
        </div>

        {visibleLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
              <ClipboardList className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground">No entries found</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Try adjusting your search or check back later.
            </p>
          </div>
        ) : (
          <>
            {/* Column Headers - Sticky below toolbar (toolbar height ~61px) */}
            <div className="sticky top-[108px] sm:top-[61px] z-10 hidden sm:flex items-center px-5 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide border-b border-border bg-muted/90 backdrop-blur-sm">
              <div className="w-[30%]">Item & Brand</div>
              <div className="hidden sm:block w-[15%]">Stage</div>
              <div className="hidden md:block w-[15%]">Inputs</div>
              <div className="hidden sm:block w-[15%]">Produced</div>
              <div className="w-[15%]">Updated By</div>
              <div className="flex-1 text-right">Actions</div>
            </div>

            {/* List Rows */}
            <div className="divide-y divide-border">
              {visibleLogs.map((entry) => (
                <LogCard
                  key={entry.id}
                  entry={entry}
                  isAdmin={isAdmin}
                  onEdit={setEditTarget}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Edit dialog */}
      {isAdmin && (
        <EditLogDialog
          entry={editTarget}
          onOpenChange={(v: boolean) => !v && setEditTarget(null)}
          onSave={(id: string, shift: string, data: LogEntry['data']) => {
            updateEntry(id, { shift, data });
            setEditTarget(null);
          }}
        />
      )}

      {/* Delete confirmation */}
      {isAdmin && (
        <AlertDialog
          open={!!deleteTarget}
          onOpenChange={(v) => !v && setDeleteTarget(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Log Entry?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove the entry for{' '}
                <span className="font-medium text-foreground">
                  {deleteTarget?.itemName}
                </span>{' '}
                submitted by{' '}
                <span className="font-medium text-foreground">
                  {deleteTarget?.userName}
                </span>
                . This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => {
                  if (deleteTarget) deleteEntry(deleteTarget.id);
                  setDeleteTarget(null);
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </RootLayout>
  );
}
