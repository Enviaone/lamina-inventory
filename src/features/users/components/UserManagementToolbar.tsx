import { ChevronDown, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { UserRole } from '@/types/auth';
import { STAGES } from '@/types/manufacturing';
import { roleLabel } from '@/features/users/utils/user-utils';

const ALL_STAGE_ROLES: UserRole[] = STAGES.map((s) => s.id as UserRole);

interface UserManagementToolbarProps {
  search: string;
  setSearch: (val: string) => void;
  stageFilter: UserRole[];
  toggleStageFilter: (role: UserRole) => void;
  setStageFilter: (roles: UserRole[]) => void;
  statusFilter: 'all' | 'active' | 'inactive';
  setStatusFilter: (val: 'all' | 'active' | 'inactive') => void;
  onAddUser: () => void;
}

export function UserManagementToolbar({
  search,
  setSearch,
  stageFilter,
  toggleStageFilter,
  setStageFilter,
  statusFilter,
  setStatusFilter,
  onAddUser,
}: UserManagementToolbarProps) {
  const activeStageFilterCount = stageFilter.length;

  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9 bg-transparent border-0 shadow-none focus-visible:ring-0 text-sm placeholder:text-muted-foreground"
        />
      </div>

      <div className="h-5 w-px bg-border shrink-0" />

      {/* Stage filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 gap-1.5 text-muted-foreground font-normal shrink-0"
          >
            Stage
            {activeStageFilterCount > 0 && (
              <Badge className="h-4 w-4 p-0 flex items-center justify-center text-[10px] rounded-full">
                {activeStageFilterCount}
              </Badge>
            )}
            <ChevronDown className="w-3.5 h-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-52">
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Filter by stage
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {ALL_STAGE_ROLES.map((role) => (
            <DropdownMenuCheckboxItem
              key={role}
              checked={stageFilter.includes(role)}
              onCheckedChange={() => toggleStageFilter(role)}
            >
              {roleLabel(role)}
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

      {/* Status filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 gap-1.5 text-muted-foreground font-normal shrink-0"
          >
            {statusFilter === 'all'
              ? 'Status'
              : statusFilter === 'active'
                ? '● Active'
                : '○ Inactive'}
            <ChevronDown className="w-3.5 h-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40">
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Filter by status
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
          >
            <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="active">Active</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="inactive">
              Inactive
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="h-5 w-px bg-border shrink-0" />

      {/* Add User */}
      <Button size="sm" className="gap-2 shrink-0 h-9" onClick={onAddUser}>
        <Plus className="w-4 h-4" />
        Add User
      </Button>
    </div>
  );
}
