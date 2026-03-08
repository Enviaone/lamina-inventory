import { format, parseISO } from 'date-fns';
import { Pencil, Phone, Shield, Trash2, UserCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ManagedUser } from '@/store/users-store';
import { roleLabel } from '@/features/users/utils/user-utils';

export interface UserRowProps {
  user: ManagedUser;
  isSelf: boolean;
  onEdit: (user: ManagedUser) => void;
  onDelete: (user: ManagedUser) => void;
}

export function UserRow({ user, isSelf, onEdit, onDelete }: UserRowProps) {
  const isAdmin = user.roles.includes('ADMIN');

  return (
    <div className="flex items-center gap-4 px-5 py-3.5 border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
      {/* Avatar */}
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isAdmin ? 'bg-primary/10' : 'bg-muted'}`}
      >
        {isAdmin ? (
          <Shield className="w-4 h-4 text-primary" />
        ) : (
          <UserCircle2 className="w-4 h-4 text-muted-foreground" />
        )}
      </div>

      {/* Name + email */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-foreground">
            {user.name}
          </span>
          {isSelf && (
            <Badge className="text-[10px] h-4 px-1.5 bg-primary/15 text-primary border-primary/30 hover:bg-primary/15">
              You
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
      </div>

      {/* Phone */}
      <div className="hidden lg:flex flex-1 items-center gap-1 text-xs text-muted-foreground">
        {user.phone ? (
          <>
            <Phone className="w-3 h-3 shrink-0" />
            {user.phone}
          </>
        ) : (
          <span className="text-border">—</span>
        )}
      </div>

      {/* Roles */}
      <div className="hidden sm:flex items-center gap-1 flex-wrap flex-[1.5]">
        {user.roles.map((r) => (
          <Badge
            key={r}
            variant={r === 'ADMIN' ? 'default' : 'outline'}
            className="text-sm px-2"
          >
            {roleLabel(r)}
          </Badge>
        ))}
      </div>

      {/* Status */}
      <div className="flex w-20">
        <Badge
          variant="outline"
          className={`text-[10px] h-5 px-2 ${
            user.isActive
              ? 'text-emerald-600 border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30'
              : 'text-muted-foreground'
          }`}
        >
          {user.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      {/* Since */}
      <div className="hidden md:block text-xs text-muted-foreground w-24">
        {format(parseISO(user.createdAt), 'MMM dd, yyyy')}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5 w-20 justify-end shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => onEdit(user)}
        >
          <Pencil className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive disabled:opacity-30"
          onClick={() => onDelete(user)}
          disabled={isSelf}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
