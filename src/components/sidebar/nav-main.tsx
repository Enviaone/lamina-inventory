import { ChevronRight } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/constants/nav-items';

export function NavMain({ items }: { items: NavItem[] }) {
  const location = useLocation();
  const { setOpenMobile, isMobile } = useSidebar();

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) =>
          item.children && item.children.length > 0 ? (
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
                    className="h-10"
                    isActive={item.children.some((c) =>
                      location.pathname.startsWith(c.url),
                    )}
                  >
                    <item.icon className="shrink-0" />
                    <span className="flex-1 truncate">{item.title}</span>
                    <ChevronRight className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenuSub>
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
                            <child.icon className="shrink-0" />
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
                isActive={location.pathname.startsWith(item.url)}
                className="h-10"
              >
                <NavLink to={item.url} viewTransition onClick={handleNavClick}>
                  <item.icon className="shrink-0" />
                  <span>{item.title}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ),
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
