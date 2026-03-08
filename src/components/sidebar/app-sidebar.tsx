import * as React from 'react';
import { PackageIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { NavMain } from '@/components/sidebar/nav-main';
import { NavUser } from '@/components/sidebar/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useAuthStore } from '@/store/auth-store';
import { getNavItemsForRoles } from '@/constants/nav-items';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore();

  const navItems = user ? getNavItemsForRoles(user.roles ?? [user.role]) : [];

  const sidebarUser = {
    name: user?.name ?? 'Guest',
    email: user?.email ?? '',
    avatar: '',
    role: user?.stageName ?? '',
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-3 sm:p-4 lg:p-5 pb-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <NavLink to="/" viewTransition>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <PackageIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Lamina Inventory
                  </span>
                  {user && (
                    <span className="truncate text-xs text-sidebar-foreground/60">
                      {user.stageName}
                    </span>
                  )}
                </div>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
