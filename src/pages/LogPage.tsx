import { useState } from 'react';
import { ClipboardList } from 'lucide-react';

import { RootLayout } from '@/layouts/RootLayout';
import { PageHeader } from '@/components/shared/PageHeader';
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
import { useLogStore, type LogEntry } from '@/store/log-store';
import { useAuthStore } from '@/store/auth-store';
import { LogCard } from '@/features/logs/components/LogCard';
import { EditLogDialog } from '@/features/logs/components/EditLogDialog';

export default function LogPage() {
  const { logs, updateEntry, deleteEntry } = useLogStore();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'ADMIN';

  const [editTarget, setEditTarget] = useState<LogEntry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LogEntry | null>(null);

  const visibleLogs = (
    isAdmin ? logs : logs.filter((l) => l.userId === user?.id)
  )
    .slice()
    .sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
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

      {/* Summary strip */}
      <div className="flex items-center gap-3 mb-6 text-sm">
        <span className="text-muted-foreground">
          <span className="font-semibold text-foreground">
            {visibleLogs.length}
          </span>{' '}
          total entries
        </span>
      </div>

      {/* Empty state */}
      {visibleLogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
            <ClipboardList className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="font-semibold text-foreground">No entries yet</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            Entries will appear here after stages are reviewed and recorded.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
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
      )}

      {/* Edit dialog */}
      {isAdmin && (
        <EditLogDialog
          key={editTarget?.id}
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
