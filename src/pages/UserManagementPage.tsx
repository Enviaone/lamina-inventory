import { useState } from 'react';
import { Users } from 'lucide-react';

import { RootLayout } from '@/layouts/RootLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
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
import { useUsersStore, type ManagedUser } from '@/store/users-store';
import { useAuthStore } from '@/store/auth-store';
import type { UserRole } from '@/types/auth';
import { UserRow } from '@/features/users/components/UserRow';
import { UserFormDialog } from '@/features/users/components/UserFormDialog';
import { UserManagementStats } from '@/features/users/components/UserManagementStats';
import { UserManagementToolbar } from '@/features/users/components/UserManagementToolbar';

export default function UserManagementPage() {
  const { users, add, update, remove } = useUsersStore();
  const currentUser = useAuthStore((s) => s.user);

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ManagedUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ManagedUser | null>(null);

  // ── Filters ──────────────────────────────────────────────────────────────────
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<UserRole[]>([]);
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive'
  >('all');

  const toggleStageFilter = (role: UserRole) =>
    setStageFilter((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );

  // ── Filtered list ─────────────────────────────────────────────────────────────
  const filtered = users.filter((u) => {
    if (
      search &&
      !u.name.toLowerCase().includes(search.toLowerCase()) &&
      !u.email.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (stageFilter.length > 0 && !stageFilter.some((r) => u.roles.includes(r)))
      return false;
    if (statusFilter === 'active' && !u.isActive) return false;
    if (statusFilter === 'inactive' && u.isActive) return false;
    return true;
  });

  const adminCount = users.filter((u) => u.roles.includes('ADMIN')).length;
  const stageCount = users.filter((u) => !u.roles.includes('ADMIN')).length;
  const activeCount = users.filter((u) => u.isActive).length;

  const emailInUse = (email: string) =>
    users.some((u) => u.email.toLowerCase() === email.toLowerCase());

  const hasFilters = search || stageFilter.length > 0 || statusFilter !== 'all';

  return (
    <RootLayout>
      <PageHeader
        title="User Management"
        description="Manage who has access to Lamina and what they can do"
      />

      {/* Summary strip as a stat card group */}
      <UserManagementStats
        totalUsers={users.length}
        adminCount={adminCount}
        stageCount={stageCount}
        activeCount={activeCount}
      />

      {/* ── Card ── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {/* Toolbar */}
        <UserManagementToolbar
          search={search}
          setSearch={setSearch}
          stageFilter={stageFilter}
          toggleStageFilter={toggleStageFilter}
          setStageFilter={setStageFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onAddUser={() => setCreateOpen(true)}
        />

        {/* Column headers */}
        <div className="hidden sm:flex items-center gap-4 px-5 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide border-b border-border bg-muted/30">
          <div className="w-9 shrink-0" />
          <div className="flex-1">Name / Email</div>
          <div className="hidden lg:block flex-1">Phone</div>
          <div className="flex-[1.5]">Roles</div>
          <div className="w-20">Status</div>
          <div className="w-24">Since</div>
          <div className="w-20 text-right" />
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <Users className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {hasFilters
                ? 'No users match the current filters.'
                : 'No users yet.'}
            </p>
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch('');
                  setStageFilter([]);
                  setStatusFilter('all');
                }}
              >
                Clear all filters
              </Button>
            )}
          </div>
        ) : (
          filtered.map((u) => (
            <UserRow
              key={u.id}
              user={u}
              isSelf={u.id === currentUser?.id}
              onEdit={setEditTarget}
              onDelete={setDeleteTarget}
            />
          ))
        )}
      </div>

      {/* Create dialog */}
      <UserFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        emailInUse={emailInUse}
        onSave={(data) => add(data)}
      />

      {/* Edit dialog */}
      <UserFormDialog
        key={editTarget?.id}
        open={!!editTarget}
        onOpenChange={(v) => !v && setEditTarget(null)}
        initial={editTarget ?? undefined}
        emailInUse={() => false}
        onSave={(data) => {
          if (editTarget) update(editTarget.id, data);
          setEditTarget(null);
        }}
      />

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-medium text-foreground">
                {deleteTarget?.name}
              </span>{' '}
              will be permanently removed and lose all access. This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteTarget) remove(deleteTarget.id);
                setDeleteTarget(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </RootLayout>
  );
}
