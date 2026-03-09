import { useState } from 'react';
import { Check, ChevronDown, InfoIcon, Phone, Shield, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ResponsiveDialog } from '@/components/shared/ResponsiveDialog';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ManagedUser } from '@/store/users-store';
import type { UserRole } from '@/types/auth';
import { STAGES } from '@/types/manufacturing';
import { roleLabel } from '@/features/users/utils/user-utils';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ALL_STAGE_ROLES: UserRole[] = STAGES.map((s) => s.id as UserRole);

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: ManagedUser;
  onSave: (data: Omit<ManagedUser, 'id' | 'createdAt'>) => void;
  emailInUse: (email: string) => boolean;
}

export function UserFormDialog({
  open,
  onOpenChange,
  initial,
  onSave,
  emailInUse,
}: UserFormDialogProps) {
  const isEdit = !!initial;

  const [prevInitial, setPrevInitial] = useState<ManagedUser | undefined>(
    initial,
  );
  const [name, setName] = useState(initial?.name ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [phone, setPhone] = useState(initial?.phone ?? '');
  const [password, setPassword] = useState(initial?.password ?? '');
  const [roles, setRoles] = useState<UserRole[]>(initial?.roles ?? []);
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [error, setError] = useState('');

  if (initial !== prevInitial) {
    setPrevInitial(initial);
    setName(initial?.name ?? '');
    setEmail(initial?.email ?? '');
    setPhone(initial?.phone ?? '');
    setPassword(initial?.password ?? '');
    setRoles(initial?.roles ?? []);
    setIsActive(initial?.isActive ?? true);
    setError('');
  }

  const isAdmin = roles.includes('ADMIN');

  const handleOpenChange = (v: boolean) => {
    if (v) {
      setName(initial?.name ?? '');
      setEmail(initial?.email ?? '');
      setPhone(initial?.phone ?? '');
      setPassword(initial?.password ?? '');
      setRoles(initial?.roles ?? []);
      setIsActive(initial?.isActive ?? true);
      setError('');
    }
    onOpenChange(v);
  };

  const toggleRole = (role: UserRole) => {
    if (role === 'ADMIN') {
      setRoles(roles.includes('ADMIN') ? [] : ['ADMIN']);
      return;
    }
    if (isAdmin) return;
    setRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };

  const handleSave = () => {
    setError('');
    if (!name.trim()) return setError('Name is required.');
    if (!email.trim()) return setError('Email is required.');
    if (!password.trim()) return setError('Password is required.');
    if (roles.length === 0)
      return setError('At least one role must be assigned.');
    if (!isEdit && emailInUse(email.trim()))
      return setError('Email is already in use.');

    onSave({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      password: password.trim(),
      roles,
      isActive,
    });
    onOpenChange(false);
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={handleOpenChange}
      title={isEdit ? 'Edit User' : 'Add User'}
      description={
        isEdit
          ? 'Update the user details and assigned roles.'
          : 'Create a new user and assign their roles.'
      }
      desktopClassName="max-w-md"
    >
      <UserFormInputs
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        phone={phone}
        setPhone={setPhone}
        password={password}
        setPassword={setPassword}
        roles={roles}
        toggleRole={toggleRole}
        isAdmin={isAdmin}
        error={error}
        isEdit={isEdit}
        onSave={handleSave}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
}

function UserFormInputs({
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  password,
  setPassword,
  roles,
  toggleRole,
  isAdmin,
  error,
  isEdit,
  onSave,
  onCancel,
}: {
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  roles: UserRole[];
  toggleRole: (role: UserRole) => void;
  isAdmin: boolean;
  error: string;
  isEdit: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-4 py-1">
      {/* Role legend (Alert) */}
      <Alert className="mb-6 bg-blue-50/50 border-blue-100 text-blue-800 dark:bg-blue-950/20 dark:border-blue-900/50 dark:text-blue-200">
        <InfoIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <AlertDescription className="flex items-center gap-2 text-xs flex-wrap leading-relaxed">
          <Badge
            variant="default"
            className="text-[10px] bg-blue-600 hover:bg-blue-600 dark:bg-blue-500 text-white"
          >
            Administrator
          </Badge>
          <span>role cannot be combined with stage roles.</span>
          <Badge
            variant="outline"
            className="text-[10px] border-blue-200 dark:border-blue-800"
          >
            Stage Role
          </Badge>
          <span>roles can be combined freely.</span>
        </AlertDescription>
      </Alert>

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="u-name">Full Name</Label>
        <Input
          id="u-name"
          placeholder="e.g. Rajan Mehta"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="u-email">Email</Label>
        <Input
          id="u-email"
          type="email"
          placeholder="user@lamina.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="u-phone">Phone </Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            id="u-phone"
            type="tel"
            placeholder="+91 98400 00000"
            className="pl-9"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>

      {/* Password (if new user or changing it) - simplified visual for brevity */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="u-password">
          Password{' '}
          {isEdit && (
            <span className="text-muted-foreground font-normal">
              (Leave blank to keep current)
            </span>
          )}
        </Label>
        <Input
          id="u-password"
          type="text"
          placeholder={isEdit ? '••••••••' : 'Enter temporary password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Roles */}
      <div className="flex flex-col gap-1.5">
        <Label>Roles</Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="justify-between font-normal">
              {roles.length === 0
                ? 'Select roles…'
                : roles.map(roleLabel).join(', ')}
              <ChevronDown className="w-4 h-4 ml-2 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64">
            <DropdownMenuLabel className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Shield className="w-3 h-3" /> Admin (exclusive)
            </DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={isAdmin}
              onCheckedChange={() => toggleRole('ADMIN')}
            >
              Administrator
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Stage Roles (combinable)
            </DropdownMenuLabel>
            {ALL_STAGE_ROLES.map((role) => (
              <DropdownMenuCheckboxItem
                key={role}
                checked={roles.includes(role)}
                disabled={isAdmin}
                onCheckedChange={() => toggleRole(role)}
              >
                {roleLabel(role)}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {roles.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {roles.map((r) => (
              <Badge key={r} variant="secondary" className="gap-1 pr-1">
                {roleLabel(r)}
                <button
                  type="button"
                  onClick={() => toggleRole(r)}
                  className="hover:text-destructive transition-colors ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {isAdmin && (
        <div className="flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 text-sm text-amber-700 dark:text-amber-400">
          <Shield className="w-4 h-4 shrink-0 mt-0.5" />
          Admin role is exclusive and cannot be combined with any stage role.
        </div>
      )}

      {error && (
        <p className="flex items-center gap-1.5 text-sm text-destructive">
          <X className="w-3.5 h-3.5" /> {error}
        </p>
      )}

      <div className="pt-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2">
        <Button
          type="button"
          variant="outline"
          className="mt-2 sm:mt-0"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button onClick={onSave}>
          <Check className="w-4 h-4 mr-1.5" />
          {isEdit ? 'Save Changes' : 'Add User'}
        </Button>
      </div>
    </div>
  );
}
