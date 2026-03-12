/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import {
  useForm,
  type UseFormRegister,
  type FieldErrors,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronDown, Phone, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { userFormSchema, type UserFormSchema } from '@/schema/user.schema';

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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UserFormSchema>({
    resolver: zodResolver(userFormSchema) as any, // Cast due to strict zod vs rhf types
    defaultValues: {
      name: initial?.name ?? '',
      email: initial?.email ?? '',
      phone: initial?.phone ?? '',
      password: initial?.password ?? '',
      roles: (initial?.roles as string[]) ?? [],
      isActive: initial?.isActive ?? true,
    },
  });

  const roles = watch('roles') || [];
  const isAdmin = roles.includes('ADMIN');

  React.useEffect(() => {
    if (open) {
      reset({
        name: initial?.name ?? '',
        email: initial?.email ?? '',
        phone: initial?.phone ?? '',
        password: initial?.password ?? '',
        roles: (initial?.roles as string[]) ?? [],
        isActive: initial?.isActive ?? true,
      });
    }
  }, [open, initial, reset]);

  const toggleRole = (role: UserRole) => {
    if (role === 'ADMIN') {
      setValue('roles', roles.includes('ADMIN') ? [] : ['ADMIN']);
      return;
    }
    if (isAdmin) return;
    const currentRoles = roles as string[];
    const newRoles = currentRoles.includes(role)
      ? currentRoles.filter((r) => r !== role)
      : [...currentRoles, role];
    setValue('roles', newRoles);
  };

  const onSubmit = (data: UserFormSchema) => {
    if (!isEdit && emailInUse(data.email)) {
      return;
    }
    onSave(data as unknown as Omit<ManagedUser, 'id' | 'createdAt'>);
    onOpenChange(false);
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Edit User' : 'Add User'}
      description={
        isEdit
          ? 'Update the user details and assigned roles.'
          : 'Create a new user and assign their roles.'
      }
      desktopClassName="max-w-md"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <UserFormInputs
          register={register}
          roles={roles as UserRole[]}
          toggleRole={toggleRole}
          isAdmin={isAdmin}
          errors={errors}
          isEdit={isEdit}
          onCancel={() => onOpenChange(false)}
        />
      </form>
    </ResponsiveDialog>
  );
}

function UserFormInputs({
  register,
  roles,
  toggleRole,
  isAdmin,
  errors,
  isEdit,
  onCancel,
}: {
  register: UseFormRegister<UserFormSchema>;
  roles: UserRole[];
  toggleRole: (role: UserRole) => void;
  isAdmin: boolean;
  errors: FieldErrors<UserFormSchema>;
  isEdit: boolean;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-4 py-1">
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="u-name">Full Name</Label>
        <Input
          id="u-name"
          placeholder="e.g. Rajan Mehta"
          {...register('name')}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="u-email">Email</Label>
        <Input
          id="u-email"
          type="email"
          placeholder="user@lamina.com"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
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
            {...register('phone')}
          />
        </div>
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="u-password">Password</Label>
        <Input
          id="u-password"
          type="text"
          placeholder={isEdit ? '••••••••' : 'Enter password'}
          {...register('password')}
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      {/* Roles */}
      <div className="flex flex-col gap-1.5 min-w-0">
        <Label>Roles</Label>
        <DropdownMenu>
          <DropdownMenuTrigger className="max-w-xs" asChild>
            <Button
              variant="outline"
              type="button"
              className="justify-between font-normal w-full"
            >
              <span className="truncate text-left flex-1 min-w-0 mr-2">
                {roles.length === 0
                  ? 'Select roles…'
                  : roles.map(roleLabel).join(', ')}
              </span>
              <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
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
        {errors.roles && (
          <p className="text-xs text-destructive">{errors.roles.message}</p>
        )}
      </div>

      {isAdmin && (
        <div className="flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 text-sm text-amber-700 dark:text-amber-400">
          <Shield className="w-4 h-4 shrink-0 mt-0.5" />
          Admin role is exclusive and cannot be combined with any stage role.
        </div>
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
        <Button type="submit">
          <Check className="w-4 h-4 mr-1.5" />
          {isEdit ? 'Save Changes' : 'Add User'}
        </Button>
      </div>
    </div>
  );
}
