import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  MapPin,
  ClipboardList,
  Users,
  PieChart,
  LogOut,
} from 'lucide-react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useAuthStore } from '@/store/auth-store';
import { STAGES } from '@/types/manufacturing';

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem
            onSelect={() => runCommand(() => navigate('/dashboard'))}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/brands'))}>
            <Package className="mr-2 h-4 w-4" />
            <span>Brands</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate('/locations'))}
          >
            <MapPin className="mr-2 h-4 w-4" />
            <span>Locations</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Manufacturing Stages">
          {STAGES.map((stage) => (
            <CommandItem
              key={stage.id}
              onSelect={() =>
                runCommand(() =>
                  navigate(
                    `/stages/${stage.id.toLowerCase().replace(/_/g, '-')}`,
                  ),
                )
              }
            >
              <ClipboardList className="mr-2 h-4 w-4" />
              <span>{stage.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          {user?.role === 'ADMIN' && (
            <CommandItem onSelect={() => runCommand(() => navigate('/users'))}>
              <Users className="mr-2 h-4 w-4" />
              <span>User Management</span>
            </CommandItem>
          )}
          <CommandItem onSelect={() => runCommand(() => navigate('/reports'))}>
            <PieChart className="mr-2 h-4 w-4" />
            <span>Reports</span>
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                logout();
                navigate('/login');
              })
            }
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
