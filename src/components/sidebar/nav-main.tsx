import { ChevronRight } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useSidebar } from '@/hooks/use-sidebar';
import type { NavGroup } from '@/constants/nav-items';
import { cn } from '@/lib/utils';

export function NavMain({ groups }: { groups: NavGroup[] }) {
  const location = useLocation();
  const { setOpenMobile, isMobile } = useSidebar();

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group.label}>
          <SidebarGroupLabel className="text-[10px] font-medium tracking-widest text-sidebar-foreground/70 mb-1">
            {group.label}
          </SidebarGroupLabel>
          <SidebarMenu>
            {group.items.map((item) => {
              const isActive = location.pathname.startsWith(item.url);

              return item.children && item.children.length > 0 ? (
                // ── Collapsible group ──────────────────────────────────────
                <Collapsible
                  key={item.title}
                  defaultOpen={item.children.some((c) =>
                    location.pathname.startsWith(c.url),
                  )}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className="h-9 transition-all duration-200"
                        isActive={isActive}
                      >
                        <item.icon
                          className={cn(
                            'shrink-0 size-4',
                            isActive
                              ? 'text-sidebar-accent-foreground'
                              : 'text-muted-foreground/70',
                          )}
                        />
                        <span
                          className={cn(
                            'flex-1 truncate font-medium',
                            isActive
                              ? 'text-sidebar-accent-foreground'
                              : 'text-muted-foreground',
                          )}
                        >
                          {item.title}
                        </span>
                        <ChevronRight className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub className="ml-4 border-l-0 pl-2">
                        {item.children.map((child) => (
                          <SidebarMenuSubItem key={child.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={location.pathname.startsWith(child.url)}
                            >
                              <NavLink
                                to={child.url}
                                viewTransition
                                onClick={handleNavClick}
                              >
                                <child.icon className="shrink-0 size-3.5" />
                                <span>{child.title}</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                // ── Flat item ──────────────────────────────────────────────
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isActive}
                    className="h-9 transition-all duration-200 px-3 rounded-lg"
                  >
                    <NavLink
                      to={item.url}
                      viewTransition
                      onClick={handleNavClick}
                    >
                      <item.icon
                        className={cn(
                          'shrink-0 size-4',
                          isActive
                            ? 'text-sidebar-accent-foreground'
                            : 'text-muted-foreground',
                        )}
                      />
                      <span
                        className={cn(
                          'font-medium text-[13px]',
                          isActive
                            ? 'text-sidebar-accent-foreground'
                            : 'text-muted-foreground',
                        )}
                      >
                        {item.title}
                      </span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
